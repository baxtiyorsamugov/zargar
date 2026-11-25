"""Serve the storefront locally, including byte ranges for video seeking."""

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
from pathlib import Path
import re


class StorefrontHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        self.byte_range = None
        requested = self.headers.get("Range")
        path = Path(self.translate_path(self.path))
        if not requested or not path.is_file() or self.headers.get("If-Range"):
            return super().send_head()

        try:
            source = path.open("rb")
        except OSError:
            self.send_error(404, "File not found")
            return None
        metadata = os.fstat(source.fileno())
        size = metadata.st_size
        match = re.fullmatch(r"bytes=(\d*)-(\d*)", requested.strip())
        start, end = 0, -1
        if match and any(match.groups()) and size:
            first, last = match.groups()
            if first:
                start = int(first)
                end = min(int(last), size - 1) if last else size - 1
            elif int(last) > 0:
                start, end = max(0, size - int(last)), size - 1
        if not 0 <= start <= end < size:
            source.close()
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{size}")
            self.send_header("Content-Length", "0")
            self.end_headers()
            return None

        self.byte_range = (start, end)
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(str(path)))
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(end - start + 1))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Last-Modified", self.date_time_string(metadata.st_mtime))
        self.end_headers()
        return source

    def copyfile(self, source, outputfile):
        if self.byte_range is None:
            return super().copyfile(source, outputfile)
        start, end = self.byte_range
        source.seek(start)
        remaining = end - start + 1
        while remaining:
            chunk = source.read(min(64 * 1024, remaining))
            if not chunk:
                break
            outputfile.write(chunk)
            remaining -= len(chunk)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("port", type=int, nargs="?", default=8000)
    parser.add_argument("--bind", default="127.0.0.1")
    args = parser.parse_args()
    frontend = Path(__file__).resolve().parents[1] / "frontend"
    handler = partial(StorefrontHandler, directory=str(frontend))
    with ThreadingHTTPServer((args.bind, args.port), handler) as server:
        print(f"SOFIZAR: http://{args.bind}:{args.port}", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
