package palette

import (
	"fmt"
	"strings"
)

// Group is one color-link line.
type Group struct {
	Name  string
	Style string
}

func Parse(text string) ([]Group, error) {
	var groups []Group
	for i, line := range strings.Split(text, "\n") {
		if !strings.HasPrefix(line, "color-link") {
			continue
		}
		f := strings.Fields(line)
		if len(f) < 3 {
			return nil, fmt.Errorf("line %d: want 3 fields, got %d", i+1, len(f))
		}
		groups = append(groups, Group{Name: f[1], Style: strings.Trim(f[2], `"`)})
	}
	return groups, nil
}
