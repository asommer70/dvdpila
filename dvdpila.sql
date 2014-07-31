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
-- Name: dvds; Type: TABLE; Schema: public; Tablespace: 
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
    playback_time numeric,
    CONSTRAINT rating_valid CHECK (((rating > 1) OR (rating < 5)))
);



ALTER TABLE ONLY dvds ALTER COLUMN id SET DEFAULT nextval('dvds_id_seq'::regclass);


--
-- Name: dvds_pkey; Type: CONSTRAINT; Schema: public; Tablespace: 
--

ALTER TABLE ONLY dvds
    ADD CONSTRAINT dvds_pkey PRIMARY KEY (id);


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
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

