package controllers

import (
	"net/http"
	"github.com/julienschmidt/httprouter"
)

type DvdController struct{}

func NewDvdController() *DvdController {
	return &DvdController{}
}

func (dc DvdController) CreateDvd(res http.ResponseWriter, req http.Request, p httprouter.Params) {

}