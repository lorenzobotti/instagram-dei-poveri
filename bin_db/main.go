package main

import (
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"time"
)

func main() {
	store, err := LoadFolder()
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
	}

	port := os.Getenv("PORT")
	fmt.Println("listening on port", port)

	http.ListenAndServe(":"+port, NewStoreApi(store))
}

func init() {
	rand.Seed(time.Now().Unix())
}
