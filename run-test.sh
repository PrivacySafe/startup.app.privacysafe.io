#!/bin/bash
tester_dir="$(dirname ${BASH_SOURCE[0]})"

data_dir="$tester_dir/test-data"
test_conf="$tester_dir/test-setup.json"
ln_to_platform="$tester_dir/test-runner"

if [ -n "$1" ]
then
	platform="$1"
elif ! readlink "$ln_to_platform" > /dev/null
then
	echo "You should either provide path to platform executable in the first argument, or have link it symbolically at $ln_to_platform"
	exit 1;
else
	platform="$(readlink "$ln_to_platform")"
fi

echo "Starting test run on $platform with data folder $data_dir"

$platform "--data-dir=$data_dir" --allow-multi-instances --devtools "--test-stand=$test_conf"
