package db

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"log"
	"flag"
)

// DB ... export the database connection for use by models and such.
var Db *gorm.DB

func Connect() {
	var err error

	if flag.Lookup("test.v") != nil {
		Db, err = gorm.Open("postgres", "host=localhost user=pila dbname=dvdpila_test sslmode=disable password=dvds")
	} else {
		Db, err = gorm.Open("postgres", "host=localhost user=pila dbname=dvdpila_dev sslmode=disable password=dvds")
	}
	Check(err, "gorm.Open")

	//log.Println("Db.DB().Ping():", Db.DB().Ping())
}


// Check ... wrapper for printing errors where needed.
func Check(err error, label string) {
	if err != nil {
		log.Println(label + " err:", err)
	}
}