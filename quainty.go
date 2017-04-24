/*
quainty.go -
  The main GoLang script for this project.
*/

package main

import (
  "fmt"
)

func main() {
  fmt.Println("test1")
  go RunServer()
  fmt.Println("test2")
}
