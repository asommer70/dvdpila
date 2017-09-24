package models

import (
"testing"
"dvdpila/db"
"flag"
)

func init() {
	ldb = db.Connect()
	if flag.Lookup("test.v") != nil {
		CreateTables(ldb)
	}

	dvd = Dvd{
		Title:        "Ghost In The Shell",
		Rating:       5,
		AbstractTxt:  `In the near future, the vast majority of humans are [[Human enhancement|augmented]] with cybernetics, enhancing various traits like vision, strength, and intelligence. Hanka Robotics, the world's leading developer of augmentative technology, establishes a secret project to develop a mechanical body, or "shell", that can [[Brain–computer interface|integrate]] a human brain rather than an [[artificial intelligence|AI]]. `,
		AbstractSrc:  "Wikipedia",
		AbstractURL:  "https://en.wikipedia.org/wiki/Ghost_in_the_Shell_(2017_film)",
		ImageURL:     "http://dvdpila/images/posters/Ghost_in_the_Shell_2017_film.png",
		FileURL:      "http://videos/Ghost_In_The_Shell_2017.mkv",
		PlaybackTime: 0,
	}
	ldb.Create(&dvd)
}


func TestCreateDeleteTag(t *testing.T) {
	tag := Tag{
		Name: "great",
		Dvds: []Dvd{dvd},
	}
	ldb.Create(&tag)

	var tg Tag
	ldb.First(&tg, tag.ID)

	if (tg.Name != "great") {
		t.Errorf("Expected tg.Name to 'great' but it is %v", tg.Name)
	}

	ldb.Delete(&tg)

	tggId := tag.ID
	var tgg Tag
	ldb.First(&tgg, tggId)
	
	if (tgg.Name != "") {
		t.Errorf("Expected tgg.Name to be '' but it is not...")
	}
}

func TestTagHasManyDvds(t *testing.T) {
  snatched := Dvd{
		Title:        "Snatched",
		Rating:       5,
		AbstractTxt:  `Funny stuff and what not...`,
		AbstractSrc:  "Wikipedia",
		AbstractURL:  "https://en.wikipedia.org/wiki/Snatched(2017_film)",
		ImageURL:     "http://dvdpila/images/posters/Snatched.png",
		FileURL:      "http://videos/Snatched.mkv",
		PlaybackTime: 20,
	}
	ldb.Create(&snatched)
	
	tag := Tag{
		Name: "funny",
		Dvds: []Dvd{dvd, snatched},
	}
	ldb.Create(&tag)
	
	var tg Tag
	ldb.First(&tg, tag.ID)
	ldb.Model(&tg).Related(&tg.Dvds)
	
	if (len(tg.Dvds) != 2) {
	  t.Errorf("Expected len(tg.Dvds) to be 2, but it is %v", len(tg.Dvds))
	}
	
// 	ldb.Delete(&tg)
// 	ldb.Delete(&snatched)
}