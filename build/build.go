package main

import (
	"fmt"
	"os/exec"
)

func main() {
	goos := "linux"
	goarch := "386"

	out, err := exec.Command("mkdir -p " + goos + "/" + goos + "-" + goarch + " && cd " + goos + "/" + goos + "-" + goarch + " && env GOOS=goos GOARCH=" + goarch + " go build ../../../ -v && cd ../../../").Output()
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Printf("Command ran: %s\n", string(out))
}
