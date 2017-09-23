package models

import (
"testing"
"dvdpila/db"
"flag"
)

var episode Episode

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

	episode = Episode{
		Name: "Disc 1",
		EpisodeFileURL: "http://videos/Ghost_In_The_Shell_2017.mkv",
		PlaybackTime: 0,
		Dvd: dvd,
		DvdID: dvd.ID,
	}
	ldb.Create(&episode)
}


func TestCreateDeleteBookmark(t *testing.T) {
	bookmark := Bookmark{
		Name: "Funny Thing",
		Time: 20,
		Dvd: dvd,
		DvdID: dvd.ID,
	}
	ldb.Create(&bookmark)

	var bk Bookmark
	ldb.First(&bk, bookmark.ID)

	if (bk.Name != "Funny Thing") {
		t.Errorf("Expected bk.Name to be 'Funny Thing' but it is %v", bk.Name)
	}

	ldb.Delete(&bk)

	bkId := bookmark.ID
	var bks Bookmark
	ldb.First(&bks, bkId)

	if (bks.Name != "") {
		t.Errorf("Expected bks.Name to be '' but it is not...")
	}
}

func TestBookmarkBelongsToDvd(t *testing.T) {
	bookmark := Bookmark{
		Name: "Funny Thing",
		Time: 25,
		Dvd: dvd,
		DvdID: dvd.ID,
	}
	ldb.Create(&bookmark)

	var bk Bookmark
	ldb.First(&bk, bookmark.ID)
	ldb.Model(&bk).Related(&bk.Dvd)

	if (bk.Dvd.Title != "Ghost In The Shell") {
		t.Errorf("Expected ep.Dvd.Title to be 'Ghost In The Shell' but it is %v", bk.Dvd.Title)
	}
}

func TestBookmarkBelongsToEpisode(t *testing.T) {
	bookmark := Bookmark{
		Name: "Funny Thing",
		Time: 25,
		Episode: episode,
		EpisodeID: episode.ID,
	}
	ldb.Create(&bookmark)

	var bk Bookmark
	ldb.First(&bk, bookmark.ID)
	ldb.Model(&bk).Related(&bk.Episode)

	if (bk.Episode.Name != "Disc 1") {
		t.Errorf("Expected ep.Episode.Name to be 'Disc 1' but it is %v", bk.Episode.Name)
	}
}