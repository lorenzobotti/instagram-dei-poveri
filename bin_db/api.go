package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
)

type StoreApi struct {
	Store

	router *mux.Router
}

func NewStoreApi(s Store) StoreApi {
	api := StoreApi{Store: s}

	router := mux.NewRouter()
	router.HandleFunc("/", api.ServeFiles).Methods(http.MethodGet)
	router.HandleFunc("/{id}", api.ServeFile).Methods(http.MethodGet)
	router.HandleFunc("/", api.HandleAddFile).Methods(http.MethodPost)
	router.HandleFunc("/{id}", api.HandleRemoveFile).Methods(http.MethodDelete)

	api.router = router
	return api
}
w
func (s StoreApi) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	start := time.Now()

	// fmt.Printf("%s %s starting\n", r.Method, r.URL.String())
	s.router.ServeHTTP(w, r)
	// fmt.Printf("%s %s finished\n", r.Method, r.URL.String())

	elapsed := time.Since(start)
	fmt.Printf("%s %s - %dms\n", r.Method, r.URL.String(), elapsed.Milliseconds())
}

func (s StoreApi) ServeFiles(w http.ResponseWriter, r *http.Request) {
	files, err := s.Files()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Fprintln(os.Stderr, err)
		return
	}

	json.NewEncoder(w).Encode(files)
}

func (s StoreApi) ServeFile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	id, ok := vars["id"]
	if !ok {
		http.Error(w, "id wasn't specified", http.StatusBadRequest)
		return
	}

	if !s.Exists(id) {
		http.Error(w, "file not found", http.StatusNotFound)
		return
	}

	err := s.Load(id, w)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (s StoreApi) HandleAddFile(w http.ResponseWriter, r *http.Request) {
	id, err := s.Save(r.Body)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Fprintln(os.Stderr, err)
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprintf(w, `"%s"`, id)
}

func (s StoreApi) HandleRemoveFile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, ok := vars["id"]
	if !ok {
		http.Error(w, "id wasn't specified", http.StatusBadRequest)
	}

	err := s.Delete(id)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)

		if errors.Is(err, os.ErrNotExist) {
			http.Error(w, err.Error(), http.StatusNotFound)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	}
}
