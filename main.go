package main

import (
	"log"
	"github.com/julienschmidt/httprouter"
	"dvdpila/controllers"
	"dvdpila/db"
	"net/http"
	"html/template"
)

var tpl *template.Template

func init() {
	tpl = template.Must(template.ParseGlob("templates/*"))
}

func main() {
	log.Println("Executing DVD Pila!...")
	db := db.Connect()
	dc := controllers.NewDvdController(db, tpl)

	router := httprouter.New()
	router.GET("/", dc.Find)
	//router.Handle("GET", "/", dvdController.Find)

	log.Println("Listening on port 3000...")
	http.ListenAndServe("localhost:3000", router)
}