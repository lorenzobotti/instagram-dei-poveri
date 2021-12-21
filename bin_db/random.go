package main

import (
	"encoding/base64"
	"math/rand"
	"time"
)

func RandomId() string {
	randPart := base64.RawURLEncoding.EncodeToString(randomBytes(8))
	timestamp := time.Now().Format("20060102150405")

	return timestamp + "_" + randPart
}

func randomBytes(length int) []byte {
	out := make([]byte, length)

	for i := 0; i < length; i++ {
		out[i] = byte(rand.Int())
	}

	return out
}
