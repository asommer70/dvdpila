package models

import "github.com/jinzhu/gorm"

type Bookmark struct {
	gorm.Model
	Name string
	Time int
	Dvd Dvd
	Episode Episode
}