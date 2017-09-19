package models

import (
	"github.com/jinzhu/gorm"
)

type Dvd struct {
	gorm.Model
	Title string
	Rating int
	AbstractTxt string
	AbstractSrc	string
	AbstractURL	string
	ImageURL string
	FileURL	string
	PlaybackTime int
	Episodes []Episode
	Bookmarks []Bookmark
	Tags []Tag `gorm:"many2many:dvd_tags;"`
}
