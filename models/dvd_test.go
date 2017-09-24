package models

import (
	"testing"
	"dvdpila/db"
	"flag"
	//"github.com/jinzhu/gorm"
	"github.com/jinzhu/gorm"
)

var ldb *gorm.DB

func init() {
	ldb = db.Connect()
	if flag.Lookup("test.v") != nil {
		CreateTables(ldb)
	}
}


func TestCreateDeleteDvd(t *testing.T) {
	dvd := Dvd{
		Title: "Ghost In The Shell",
		Rating: 5,
		AbstractTxt: `In the near future, the vast majority of humans are [[Human enhancement|augmented]] with cybernetics, enhancing various traits like vision, strength, and intelligence. Hanka Robotics, the world's leading developer of augmentative technology, establishes a secret project to develop a mechanical body, or "shell", that can [[Brain–computer interface|integrate]] a human brain rather than an [[artificial intelligence|AI]]. `,
		AbstractSrc: "Wikipedia",
		AbstractURL: "https://en.wikipedia.org/wiki/Ghost_in_the_Shell_(2017_film)",
		ImageURL: "http://dvdpila/images/posters/Ghost_in_the_Shell_2017_film.png",
		FileURL: "http://videos/Ghost_In_The_Shell_2017.mkv",
		PlaybackTime: 0,
	}

	ldb.Create(&dvd)

	var dt Dvd
	ldb.First(&dt)

	if (dt.Title != "Ghost In The Shell") {
		t.Errorf("Expected dt.Title to be 'Ghost In The Shell' but it is %v", dt.Title)
	}

	ldb.Delete(&dt)

	var dd Dvd
	ldb.First(&dd, dt.ID)

	if (dd.Title != "") {
		t.Errorf("Expected dd.Title to be '' but it is not...")
	}
}

func TestUpdateDvd(t *testing.T) {
	dvd := Dvd{
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

	dvd.PlaybackTime = 100
	ldb.Save(&dvd)

	var dt Dvd
	ldb.First(&dt, dvd.ID)

	if (dt.PlaybackTime != 100) {
		t.Errorf("Expected dt.PlaybackTime to be 100 but it is %v", dt.PlaybackTime)
	}

	ldb.Delete(&dt)
}

func TestDvdHasManyEpisodes(t *testing.T) {
	dvd := Dvd{
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

	episode := Episode{
		Name: "Disc 1",
		EpisodeFileURL: "http://videos/Ghost_In_The_Shell_2017.mkv",
		PlaybackTime: 0,
		DvdID: dvd.ID,
	}
	ldb.Create(&episode)

	var dt Dvd
	ldb.First(&dt, dvd.ID)
	ldb.Model(&dt).Related(&dt.Episodes)

	if (len(dt.Episodes) != 1) {
		t.Errorf("Expected len(dt.Episodes) to be 1 but it is %v", len(dt.Episodes))
	}

	ldb.Delete(&episode)
	ldb.Delete(&dt)
}

func TestDvdHasManyBookmarks(t *testing.T) {
	dvd := Dvd{
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

	bookmark := Bookmark{
		Name: "Funny Thing",
		Time: 25,
		Dvd: dvd,
		DvdID: dvd.ID,
	}
	ldb.Create(&bookmark)

	var dt Dvd
	ldb.First(&dt, dvd.ID)
	ldb.Model(&dt).Related(&dt.Bookmarks)

	if (len(dt.Bookmarks) != 1) {
		t.Errorf("Expected len(dt.Bookmarks) to be 1 but it is %v", len(dt.Bookmarks))
	}

	ldb.Delete(&bookmark)
	ldb.Delete(&dt)
}

func TestDvdHasManyTags(t *testing.T) {
	great := Tag{
		Name: "great",
		Dvds: []Dvd{dvd},
	}
	ldb.Create(&great)

	funny := Tag{
		Name: "great",
		Dvds: []Dvd{dvd},
	}
	ldb.Create(&funny)

	dvd := Dvd{
		Title:        "Ghost In The Shell",
		Rating:       5,
		AbstractTxt:  `In the near future, the vast majority of humans are [[Human enhancement|augmented]] with cybernetics, enhancing various traits like vision, strength, and intelligence. Hanka Robotics, the world's leading developer of augmentative technology, establishes a secret project to develop a mechanical body, or "shell", that can [[Brain–computer interface|integrate]] a human brain rather than an [[artificial intelligence|AI]]. `,
		AbstractSrc:  "Wikipedia",
		AbstractURL:  "https://en.wikipedia.org/wiki/Ghost_in_the_Shell_(2017_film)",
		ImageURL:     "http://dvdpila/images/posters/Ghost_in_the_Shell_2017_film.png",
		FileURL:      "http://videos/Ghost_In_The_Shell_2017.mkv",
		PlaybackTime: 0,
		Tags: []Tag{funny, great},
	}
	ldb.Create(&dvd)

	var dt Dvd
	ldb.First(&dt, dvd.ID)
	ldb.Model(&dt).Related(&dt.Tags, "Tags")

	if (len(dt.Tags) != 2) {
		t.Errorf("Expected len(dt.Tags) to be 2 but it is %v", len(dt.Tags))
	}

	ldb.Delete(&great)
	ldb.Delete(&funny)
	ldb.Delete(&dt)
}