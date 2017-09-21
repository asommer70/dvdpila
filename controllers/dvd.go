package controllers

import (
	"net/http"
	"github.com/julienschmidt/httprouter"
	"github.com/jinzhu/gorm"
)

type DvdController struct{
	db *gorm.DB
}

func NewDvdController(db *gorm.DB) *DvdController {
	return &DvdController{db}
}

func (dc DvdController) Find(res http.ResponseWriter, req http.Request, p httprouter.Params) {
	// Find user by ID p.byName("id").

	// If no "id" parameter return all.

	// Or return none.
}

func (dc DvdController) Create(res http.ResponseWriter, req http.Request, p httprouter.Params) {

}

func (dc DvdController) Update(res http.ResponseWriter, req http.Request, p httprouter.Params) {
	// Find user by ID p.byName("id").

	// Update the Dvd.
}

func (dc DvdController) Delete(res http.ResponseWriter, req http.Request, p httprouter.Params) {
	// Find user by ID p.byName("id").

	// Delete the Dvd.
}