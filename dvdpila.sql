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
-- Name: dvds; Type: TABLE; Schema: public; Owner: adam; Tablespace: 
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


ALTER TABLE public.dvds OWNER TO adam;

--
-- Name: dvds_id_seq; Type: SEQUENCE; Schema: public; Owner: adam
--

CREATE SEQUENCE dvds_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dvds_id_seq OWNER TO adam;

--
-- Name: dvds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adam
--

ALTER SEQUENCE dvds_id_seq OWNED BY dvds.id;


--
-- Name: dvds_tags; Type: TABLE; Schema: public; Owner: adam; Tablespace: 
--

CREATE TABLE dvds_tags (
    id integer NOT NULL,
    dvd_id integer NOT NULL,
    tag_id integer NOT NULL
);


ALTER TABLE public.dvds_tags OWNER TO adam;

--
-- Name: dvds_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: adam
--

CREATE SEQUENCE dvds_tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dvds_tags_id_seq OWNER TO adam;

--
-- Name: dvds_tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adam
--

ALTER SEQUENCE dvds_tags_id_seq OWNED BY dvds_tags.id;


--
-- Name: episodes; Type: TABLE; Schema: public; Owner: adam; Tablespace: 
--

CREATE TABLE episodes (
    id integer NOT NULL,
    name character varying(100),
    episode_file_url character varying(300),
    dvd_id integer NOT NULL,
    playback_time numeric
);


ALTER TABLE public.episodes OWNER TO adam;

--
-- Name: episodes_id_seq; Type: SEQUENCE; Schema: public; Owner: adam
--

CREATE SEQUENCE episodes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.episodes_id_seq OWNER TO adam;

--
-- Name: episodes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adam
--

ALTER SEQUENCE episodes_id_seq OWNED BY episodes.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: adam; Tablespace: 
--

CREATE TABLE tags (
    id integer NOT NULL,
    name character varying(100)
);


ALTER TABLE public.tags OWNER TO adam;

--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: adam
--

CREATE SEQUENCE tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tags_id_seq OWNER TO adam;

--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adam
--

ALTER SEQUENCE tags_id_seq OWNED BY tags.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: adam
--

ALTER TABLE ONLY dvds ALTER COLUMN id SET DEFAULT nextval('dvds_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: adam
--

ALTER TABLE ONLY dvds_tags ALTER COLUMN id SET DEFAULT nextval('dvds_tags_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: adam
--

ALTER TABLE ONLY episodes ALTER COLUMN id SET DEFAULT nextval('episodes_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: adam
--

ALTER TABLE ONLY tags ALTER COLUMN id SET DEFAULT nextval('tags_id_seq'::regclass);


--
-- Name: dvds_pkey; Type: CONSTRAINT; Schema: public; Owner: adam; Tablespace: 
--

ALTER TABLE ONLY dvds
    ADD CONSTRAINT dvds_pkey PRIMARY KEY (id);


--
-- Name: dvds_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: adam; Tablespace: 
--

ALTER TABLE ONLY dvds_tags
    ADD CONSTRAINT dvds_tags_pkey PRIMARY KEY (id);


--
-- Name: episodes_pkey; Type: CONSTRAINT; Schema: public; Owner: adam; Tablespace: 
--

ALTER TABLE ONLY episodes
    ADD CONSTRAINT episodes_pkey PRIMARY KEY (id);


--
-- Name: name_unique; Type: CONSTRAINT; Schema: public; Owner: adam; Tablespace: 
--

ALTER TABLE ONLY tags
    ADD CONSTRAINT name_unique UNIQUE (name);


--
-- Name: tags_pkey; Type: CONSTRAINT; Schema: public; Owner: adam; Tablespace: 
--

ALTER TABLE ONLY tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: title_unique; Type: CONSTRAINT; Schema: public; Owner: adam; Tablespace: 
--

ALTER TABLE ONLY dvds
    ADD CONSTRAINT title_unique UNIQUE (title);


--
-- Name: rating; Type: INDEX; Schema: public; Owner: adam; Tablespace: 
--

CREATE INDEX rating ON dvds USING btree (rating);


--
-- Name: dvds_tags_dvd_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adam
--

ALTER TABLE ONLY dvds_tags
    ADD CONSTRAINT dvds_tags_dvd_id_fkey FOREIGN KEY (dvd_id) REFERENCES dvds(id);


--
-- Name: dvds_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adam
--

ALTER TABLE ONLY dvds_tags
    ADD CONSTRAINT dvds_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES tags(id);


--
-- Name: episodes_dvd_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adam
--

ALTER TABLE ONLY episodes
    ADD CONSTRAINT episodes_dvd_id_fkey FOREIGN KEY (dvd_id) REFERENCES dvds(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: adam
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM adam;
GRANT ALL ON SCHEMA public TO adam;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

