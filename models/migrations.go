package models

import (
	"dvdpila/db"
)

func CreateTables() {
	//res := db.Db.Exec(`SELECT EXISTS (select 1 from information_schema.tables where table_schema = 'dvdpila_test' AND table_name = 'dvds');`)
	//defer res.Close()

	dt := db.Db.HasTable(&Dvd{})

	if !dt {
		db.Db.AutoMigrate(&Dvd{})
	}
}
