package models

import (
"testing"
"dvdpila/db"
"flag"
)

var dvd Dvd

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


func TestCreateDeleteEpisode(t *testing.T) {

	episode := Episode{
		Name: "Disc 1",
		EpisodeFileURL: "http://videos/Ghost_In_The_Shell_2017.mkv",
		PlaybackTime: 0,
		Dvd: dvd,
		DvdID: dvd.ID,
	}

	ldb.Create(&episode)

	var ep Episode
	ldb.First(&ep, episode.ID)

	if (ep.Name != "Disc 1") {
		t.Errorf("Expected ep.Name to be 'Disc 1' but it is %v", ep.Name)
	}

	ldb.Delete(&ep)

	epId := ep.ID
	var epi Episode
	ldb.First(&epi, epId)

	if (epi.Name != "") {
		t.Errorf("Expected epi.Name to be '' but it is not...")
	}
}

func TestUpdateEpisode(t *testing.T) {
	episode := Episode{
		Name: "Disc 2",
		EpisodeFileURL: "http://videos/Ghost_In_The_Shell_2017.mkv",
		PlaybackTime: 0,
		Dvd: dvd,
		DvdID: dvd.ID,
	}

	ldb.Create(&episode)

	episode.PlaybackTime = 100
	ldb.Save(&episode)

	var ep Episode
	ldb.First(&ep, episode.ID)

	if (ep.PlaybackTime != 100) {
		t.Errorf("Expected ep.PlaybackTime to be 100 but it is %v", ep.PlaybackTime)
	}

	ldb.Delete(&ep)
}

func TestEpisodeBelongsToDvd(t *testing.T) {
	episode := Episode{
		Name: "Disc 3",
		EpisodeFileURL: "http://videos/Ghost_In_The_Shell_2017.mkv",
		PlaybackTime: 0,
		Dvd: dvd,
		DvdID: dvd.ID,
	}

	ldb.Create(&episode)

	episode.PlaybackTime = 100
	ldb.Save(&episode)

	var ep Episode
	ldb.First(&ep, episode.ID)
	ldb.Model(&ep).Related(&ep.Dvd)

	if (ep.Dvd.Title != "Ghost In The Shell") {
		t.Errorf("Expected ep.Dvd.Title to be 'Ghost In The Shell' but it is %v", ep.Dvd.Title)
	}
}

func TestEpisodeHasManyBookmarks(t *testing.T) {
	episode := Episode{
		Name: "Disc 3",
		EpisodeFileURL: "http://videos/Ghost_In_The_Shell_2017.mkv",
		PlaybackTime: 0,
		Dvd: dvd,
		DvdID: dvd.ID,
	}
	ldb.Create(&episode)

	bookmark := Bookmark{
		Name: "Funny Thing",
		Time: 30,
		Episode: episode,
		EpisodeID: episode.ID,
	}
	ldb.Create(&bookmark)

	var ep Episode
	ldb.First(&ep, episode.ID)
	ldb.Model(&ep).Related(&ep.Bookmarks)

	if (len(ep.Bookmarks) != 1) {
		t.Errorf("Expected len(ep.Bookmarks) to be 1 but it is %v", len(ep.Bookmarks))
	}

	ldb.Delete(&bookmark)
	ldb.Delete(&ep)
}