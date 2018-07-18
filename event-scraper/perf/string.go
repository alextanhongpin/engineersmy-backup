package perf

import "bytes"

func Concat(values ...string) string {
	var b bytes.Buffer
	for _, v := range values {
		b.WriteString(v)
	}
	return b.String()
}
