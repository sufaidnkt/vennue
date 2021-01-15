exports.getConfig = function () {
  return {
    user: 'postgres', //env var: PGUSER
    // database: 'spyce_mining', //env var: PGDATABASE
    database: 'spyce_mining_live', //env var: PGDATABASE
    password: 'postgres', //env var: PGPASSWORD
    port: 5432, //env var: PGPORT
    max: 20, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed ,
    host: '10.0.0.30',
    // host: 'localhost',
    // connectionTimeoutMillis: 2000,
  };
};



/*  create table for mobile api authentication
*******************suhail**********************

DROP TABLE IF EXISTS "mobile_user_authentication";
DROP SEQUENCE IF EXISTS mobile_user_authentication_id_seq;
CREATE SEQUENCE mobile_user_authentication_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1;

CREATE TABLE "public"."mobile_user_authentication" (
    "id" integer DEFAULT nextval('mobile_user_authentication_id_seq') NOT NULL,
    "uid" integer NOT NULL,
    "auth_token" character varying(200) NOT NULL,
    "auth_key" character varying(200) NOT NULL,
    "login_time" character varying(30) NOT NULL,
    "logout_time" character varying(30),
    CONSTRAINT "mobile_user_authentication_id" PRIMARY KEY ("id"),
    CONSTRAINT "mobile_user_authentication_uid" UNIQUE ("uid")
) WITH (oids = false);



*/

/*

|------------------------------------------------------------------
|
| *****************pgplsql Function*****************
|------------------------------------------------------------------
CREATE OR REPLACE FUNCTION check_number_of_row()
RETURNS TRIGGER AS
LANGUAGE plpgsql;


DECLARE
  total_count integer;
  limited integer;
  deleted_ids integer[];


BEGIN
    -- replace 100 by the number of rows you want
    SELECT count(*) into total_count FROM api_webhook_request_log;
    IF total_count >= 5
        THEN 
          limited = total_count-5;
          deleted_ids := array(SELECT id  FROM api_webhook_request_log ORDER BY id ASC  LIMIT limited);
        DELETE FROM api_webhook_request_log WHERE id = ANY(deleted_ids);
RETURN NULL;
    END IF;

END;
|------------------------------------------------------------------
|
|   ****************Trigger***********************
|------------------------------------------------------------------

CREATE TRIGGER tr_check_number_of_row 
AFTER INSERT ON api_webhook_request_log
FOR EACH ROW EXECUTE PROCEDURE check_number_of_row();

*/


