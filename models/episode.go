package models

import "github.com/jinzhu/gorm"

type Episode struct {
	gorm.Model
	Name string
	EpisodeFileURL string
	PlaybackTime int
	Dvd Dvd
	Bookmarks []Bookmark
}
