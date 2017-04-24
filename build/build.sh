# Convert to Python and generate Python executables.

cd $(dirname "$0")/../ # Go to the project's root directory.

# https://dave.cheney.net/2015/08/22/cross-compilation-with-go-1-5
function build() {
  #case "$os" in
  #  win)  echo "win"
  #        exit
  #        ;;
  #esac
  go build
}

function run() {
  ./Quainty.exe
}

usage="$(basename "$0") [-h] [-r]\n
\n
Options:\n
\t  -h  show this help text\n
\t  -r  runs the file after compiling"

while getopts ':hr:' option; do
  case "$option" in
    h)  echo -e $usage
        exit
        ;;
    r)  build && run
        exit
        ;;
    \?) printf "illegal operation: -%s\n" "$OPTARG" >&2
        echo "$usage" >&2
        exit 1
        ;;
  esac
done

build
shift $(($OPTIND - 1))
