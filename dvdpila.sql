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
    abstract character varying(1000),
    abstract_source character varying(100),
    abstract_url character varying(300),
    image_url character varying(100),
    file_url character varying(300),
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
-- Name: id; Type: DEFAULT; Schema: public; Owner: adam
--

ALTER TABLE ONLY dvds ALTER COLUMN id SET DEFAULT nextval('dvds_id_seq'::regclass);


--
-- Data for Name: dvds; Type: TABLE DATA; Schema: public; Owner: adam
--

COPY dvds (id, title, created_at, created_by, rating, abstract, abstract_source, abstract_url, image_url, file_url) FROM stdin;
2	Big Buck Bunny	2014-07-20 02:32:56.001999	Adam	5	Big Buck Bunny is a short computer animated comedy film by the Blender Institute, part of the Blender Foundation. Like the foundation's previous film Elephants Dream, the film was made using Blender, a free software application for animation made by the same foundation. It was released as an Open Source film under Creative Commons License Attribution 3.0.	Wikipedia	https://en.wikipedia.org/wiki/Big_Buck_Bunny	images/c75c5115.jpg	http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_640x360.m4v
3	Elephants Dream	2014-07-20 02:35:33.049107	Adam	5	Elephants Dream is a short computer-generated short film that was produced almost completely using the free software 3D suite Blender. It premiered on 24 March 2006, after about 8 months of work. Beginning in September 2005, it was developed under the name Orange by a team of seven artists and animators from around the world. It was later renamed Machina and then to Elephants Dream after the way in which Dutch children's stories abruptly end.	Wikipedia	https://en.wikipedia.org/wiki/Elephants_Dream	images/9252c944.jpg	https://archive.org/download/ElephantsDream/ed_1024.ogv
1	Sintel	2014-07-20 02:27:55.031959	Adam	5	Sintel is a short computer animated film by the Blender Institute, part of the Blender Foundation.	Wikipedia	https://en.wikipedia.org/wiki/Sintel	images/fe9b3f8f.jpg	http://peach.themazzone.com/durian/movies/sintel-1024-surround.mp4
\.


--
-- Name: dvds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adam
--

SELECT pg_catalog.setval('dvds_id_seq', 3, true);


--
-- Name: dvds_pkey; Type: CONSTRAINT; Schema: public; Owner: adam; Tablespace: 
--

ALTER TABLE ONLY dvds
    ADD CONSTRAINT dvds_pkey PRIMARY KEY (id);


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
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

