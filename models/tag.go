package models

import "github.com/jinzhu/gorm"

type Tag struct {
	gorm.Model
	Name string
	Dvds []Dvd `gorm:"many2many:dvd_tags;"`
}
