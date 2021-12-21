package main

import (
	"io"
	"net/http"
)

type TypeDetector struct {
	r io.ReadCloser

	content       []byte
	needToCapture int
	captured      int
}

func newTypeDetector(r io.ReadCloser, size int) TypeDetector {
	return TypeDetector{
		r:             r,
		content:       make([]byte, size),
		needToCapture: size,
		captured:      0,
	}
}

func (td *TypeDetector) Read(into []byte) (int, error) {
	n, err := td.r.Read(into)
	if err != nil {
		return n, err
	}

	if td.captured < td.needToCapture {
		copy(td.content[td.captured:], into)
		td.captured = len(into)
	}

	return n, err
}

func (td *TypeDetector) Close() error {
	return td.r.Close()
}

func (td *TypeDetector) Captured() []byte {
	http.DetectContentType(td.content)
	return td.content[:td.captured]
}
