package controllers

import (
	"net/http"
	"github.com/julienschmidt/httprouter"
	"github.com/jinzhu/gorm"
	"html/template"
)

type DvdController struct{
	db *gorm.DB
	tpl *template.Template
}

func NewDvdController(db *gorm.DB, tpl *template.Template) *DvdController {
	return &DvdController{db, tpl}
}

func (dc DvdController) Find(res http.ResponseWriter, req *http.Request, params httprouter.Params) {
	// Find Dvd by ID param.byName("id").

	// If no "id" parameter return all.

	// Or return none.
	//fmt.Fprintf(res, "I've Got Worms...")
	dc.tpl.ExecuteTemplate(res, "index.gohtml", nil)
}

func (dc DvdController) Create(res http.ResponseWriter, req *http.Request, params httprouter.Params) {

}

func (dc DvdController) Update(res http.ResponseWriter, req *http.Request, params httprouter.Params) {
	// Find user by ID p.byName("id").

	// Update the Dvd.
}

func (dc DvdController) Delete(res http.ResponseWriter, req *http.Request, params httprouter.Params) {
	// Find user by ID p.byName("id").

	// Delete the Dvd.
}