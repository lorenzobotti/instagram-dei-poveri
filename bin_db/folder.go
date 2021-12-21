package main

import (
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
)

type Store struct {
	Folder string
}

var (
	ErrPathNotSet = errors.New("$DB_FOLDER is not set")
	ErrNotFolder  = errors.New("$DB_FOLDER is not a folder")
)

func LoadFolder() (Store, error) {
	folderPath := os.Getenv("DB_FOLDER")
	if folderPath == "" {
		return Store{}, ErrPathNotSet
	}

	folder, err := os.Stat(folderPath)
	if errors.Is(err, os.ErrNotExist) {
		err = os.Mkdir(folderPath, 0644)
	}

	if err != nil {
		return Store{}, err
	}

	if folder != nil && !folder.IsDir() {
		return Store{}, ErrNotFolder
	}

	return Store{Folder: folderPath}, nil
}

func (s Store) Exists(id string) bool {
	path := filepath.Join(s.Folder, id)

	_, err := os.Stat(path)
	return err == nil
}

func (s Store) Files() ([]string, error) {
	dir, err := os.ReadDir(s.Folder)
	if err != nil {
		return nil, err
	}

	out := make([]string, len(dir))
	for i, filename := range dir {
		// out[i] = filepath.Dir(filename.Name())
		out[i] = filename.Name()
	}

	return out, nil
}

func (s Store) Save(contents io.Reader) (string, error) {
	id := RandomId()
	path := filepath.Join(s.Folder, id)
	fmt.Println("creating file:", path)

	out, err := os.Create(path)
	if err != nil {
		return "", err
	}

	_, err = io.Copy(out, contents)
	return id, err
}

func (s Store) Load(id string, into io.Writer) error {
	file, err := os.Open(filepath.Join(s.Folder, id))
	if err != nil {
		return err
	}

	_, err = io.Copy(into, file)
	return err
}

func (s Store) Delete(id string) error {
	path := filepath.Join(s.Folder, id)

	return os.Remove(path)
}
