--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: bookmarks; Type: TABLE; Schema: public; Tablespace:
--

CREATE TABLE bookmarks (
    id integer NOT NULL,
    name character varying(100),
    "time" numeric,
    dvd_id integer,
    episode_id integer
);


--
-- Name: bookmarks_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE bookmarks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bookmarks_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE bookmarks_id_seq OWNED BY bookmarks.id;


--
-- Name: dvds; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE dvds (
    id integer NOT NULL,
    title character varying(100),
    created_at timestamp without time zone,
    created_by character varying(30),
    rating integer,
    abstract_txt character varying(1000),
    abstract_source character varying(100),
    abstract_url character varying(300),
    image_url character varying(100),
    file_url character varying(300),
    playback_time numeric,
    CONSTRAINT rating_valid CHECK (((rating > 1) OR (rating < 5)))
);


--
-- Name: dvds_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE dvds_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dvds_tags; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE dvds_tags (
    id integer NOT NULL,
    dvd_id integer NOT NULL,
    tag_id integer NOT NULL
);


--
-- Name: dvds_tags_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE dvds_tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dvds_tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE dvds_tags_id_seq OWNED BY dvds_tags.id;


--
-- Name: episodes; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE episodes (
    id integer NOT NULL,
    name character varying(100),
    episode_file_url character varying(300),
    dvd_id integer NOT NULL,
    playback_time numeric
);


--
-- Name: episodes_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE episodes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: episodes_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE episodes_id_seq OWNED BY episodes.id;


--
-- Name: tags; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE tags (
    id integer NOT NULL,
    name character varying(100)
);


--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE tags_id_seq OWNED BY tags.id;


--
-- Name: id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY bookmarks ALTER COLUMN id SET DEFAULT nextval('bookmarks_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; 
--

ALTER TABLE ONLY dvds ALTER COLUMN id SET DEFAULT nextval('dvds_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; 
--

ALTER TABLE ONLY dvds_tags ALTER COLUMN id SET DEFAULT nextval('dvds_tags_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY episodes ALTER COLUMN id SET DEFAULT nextval('episodes_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY tags ALTER COLUMN id SET DEFAULT nextval('tags_id_seq'::regclass);


--
-- Name: bookmarks_pkey; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY bookmarks
    ADD CONSTRAINT bookmarks_pkey PRIMARY KEY (id);


--
-- Name: dvds_pkey; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY dvds
    ADD CONSTRAINT dvds_pkey PRIMARY KEY (id);


--
-- Name: dvds_tags_pkey; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY dvds_tags
    ADD CONSTRAINT dvds_tags_pkey PRIMARY KEY (id);


--
-- Name: episodes_pkey; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY episodes
    ADD CONSTRAINT episodes_pkey PRIMARY KEY (id);


--
-- Name: name_unique; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY tags
    ADD CONSTRAINT name_unique UNIQUE (name);


--
-- Name: tags_pkey; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: title_unique; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY dvds
    ADD CONSTRAINT title_unique UNIQUE (title);


--
-- Name: rating; Type: INDEX; Schema: public; Tablespace: 
--

CREATE INDEX rating ON dvds USING btree (rating);


--
-- Name: bookmarks_dvd_id_fkey; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY bookmarks
    ADD CONSTRAINT bookmarks_dvd_id_fkey FOREIGN KEY (dvd_id) REFERENCES dvds(id);


--
-- Name: bookmarks_episode_id_fkey; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY bookmarks
    ADD CONSTRAINT bookmarks_episode_id_fkey FOREIGN KEY (episode_id) REFERENCES episodes(id);


--
-- Name: dvds_tags_dvd_id_fkey; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY dvds_tags
    ADD CONSTRAINT dvds_tags_dvd_id_fkey FOREIGN KEY (dvd_id) REFERENCES dvds(id);


--
-- Name: dvds_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY dvds_tags
    ADD CONSTRAINT dvds_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES tags(id);


--
-- Name: episodes_dvd_id_fkey; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY episodes
    ADD CONSTRAINT episodes_dvd_id_fkey FOREIGN KEY (dvd_id) REFERENCES dvds(id);


--
-- Name: public; Type: ACL; Schema: -;
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

