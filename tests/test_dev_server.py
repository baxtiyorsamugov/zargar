"""Video seeking must request the exact bytes, including boundary cases."""

from functools import partial
from http.client import HTTPConnection
from http.server import ThreadingHTTPServer
from pathlib import Path
import sys
from tempfile import TemporaryDirectory
from threading import Thread
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from serve import StorefrontHandler


class QuietHandler(StorefrontHandler):
    def log_message(self, *args):
        pass


class VideoRangeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.directory = TemporaryDirectory()
        cls.content = bytes(range(256)) * 4
        (Path(cls.directory.name) / "video.mp4").write_bytes(cls.content)
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=cls.directory.name))
        cls.thread = Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()
        cls.directory.cleanup()

    def request(self, range_header=None, method="GET", extra_headers=None):
        connection = HTTPConnection(*self.server.server_address)
        headers = {"Range": range_header} if range_header else {}
        headers.update(extra_headers or {})
        connection.request(method, "/video.mp4", headers=headers)
        response = connection.getresponse()
        result = response.status, dict(response.getheaders()), response.read()
        connection.close()
        return result

    def test_full_file(self):
        status, _, body = self.request()
        self.assertEqual((status, body), (200, self.content))

    def test_explicit_range_and_head(self):
        for method in ("GET", "HEAD"):
            status, headers, body = self.request("bytes=100-199", method)
            self.assertEqual(status, 206)
            self.assertEqual(headers["Content-Range"], "bytes 100-199/1024")
            self.assertEqual(headers["Content-Length"], "100")
            self.assertEqual(body, self.content[100:200] if method == "GET" else b"")

    def test_open_suffix_and_clamped_ranges(self):
        for requested, start in (("bytes=1000-", 1000), ("bytes=-24", 1000), ("bytes=1000-9999", 1000)):
            status, _, body = self.request(requested)
            self.assertEqual((status, body), (206, self.content[start:]))

    def test_invalid_ranges_have_no_body(self):
        for requested in ("bytes=1024-", "bytes=100-99", "bytes=-0", "bytes=-", "garbage"):
            status, headers, body = self.request(requested)
            self.assertEqual((status, body), (416, b""))
            self.assertEqual(headers["Content-Range"], "bytes */1024")

    def test_if_range_falls_back_to_full_response(self):
        status, _, body = self.request("bytes=100-199", extra_headers={"If-Range": '"old-version"'})
        self.assertEqual((status, body), (200, self.content))


if __name__ == "__main__":
    unittest.main()
