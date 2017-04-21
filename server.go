/*
server.go -
	Handles web server requests.
*/
package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

// Variables
var port = ":8000"

// Structs
type Page struct {
	Path    string
	Content []byte
}

// Run the server
func RunServer() {
	http.HandleFunc("/", httpHandler)
	fmt.Println("Server is live at http://localhost" + port)
	err := http.ListenAndServe(port, nil) // set listen port
	if err != nil {
		log.Fatal("RunServer(): ", err)
	}
}

func httpHandler(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path[len("/"):]
	p, err := loadPage(path)
	if err != nil {
		p = &Page{Path: path}
	}
	w.Write(p.Content)
	fmt.Println(p.Path)
}

func loadPage(path string) (*Page, error) {
	file := path
	content, err := ioutil.ReadFile(file)
	if err != nil {
		return nil, err
	}
	return &Page{Path: path, Content: content}, nil
}
