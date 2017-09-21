package models

import (
	"github.com/jinzhu/gorm"
)

func CreateTables(db *gorm.DB) {
	//res := db.Db.Exec(`SELECT EXISTS (select 1 from information_schema.tables where table_schema = 'dvdpila_test' AND table_name = 'dvds');`)
	//defer res.Close()

	dt := db.HasTable(&Dvd{})

	if !dt {
		db.AutoMigrate(&Dvd{})
	}
}
