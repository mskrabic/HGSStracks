CREATE TABLE korisnik (
korisnickoIme VARCHAR(25) PRIMARY KEY,
lozinka VARCHAR(25) NOT NULL,
ime VARCHAR(25) NOT NULL,
prezime VARCHAR(25) NOT NULL,
brojMob VARCHAR(25) NOT NULL,
email VARCHAR(50) UNIQUE NOT NULL,
uloga VARCHAR(10) NOT NULL CHECK (uloga = 'Spasilac' OR uloga = 'Dispecer'),
status VARCHAR(25) NOT NULL CHECK (status = 'Zahtjev poslan' OR status = 'Registriran')
);

CREATE TABLE dispecer (
korisnickoIme VARCHAR(25) PRIMARY KEY REFERENCES korisnik(korisnickoIme)
);

CREATE TABLE stanica (
sifStanica VARCHAR(5) PRIMARY KEY,
nazivStanica VARCHAR(25) NOT NULL,
korImeVoditelj VARCHAR(25)
);

CREATE TABLE spasilac (
korisnickoIme VARCHAR(25) PRIMARY KEY REFERENCES korisnik(korisnickoIme),
sifStanica VARCHAR(5) REFERENCES stanica(sifStanica),
dostupan BOOLEAN NOT NULL
);

alter table stanica
ADD CONSTRAINT korImeVoditelj_fk FOREIGN KEY (korImeVoditelj) REFERENCES spasilac(korisnickoIme);

CREATE TABLE akcija (
sifAkcija VARCHAR(5) PRIMARY KEY,
	nazivAkcija VARCHAR(25) NOT NULL,
	infNestalaOsoba VARCHAR(100) NOT NULL,
	lokacija VARCHAR(25),
	korImeDispecer VARCHAR(25) REFERENCES dispecer(korisnickoIme) NOT NULL,
	status VARCHAR(10) NOT NULL CHECK (status = 'U_tijeku' OR status = 'Zavrsena') 
);

CREATE TABLE zadatak (
sifZadatak VARCHAR(5) PRIMARY KEY,
	nazivZadatak varchar(25) NOT NULL,
	korImeDispecer VARCHAR(25) references dispecer(korisnickoime) NOT NULL,
	korImeSpasilac VARCHAR(25) references spasilac(korisnickoime) NOT NULL,
	komentar VARCHAR(100)
);

CREATE TABLE spasilacAkcija (
	korImeSpasilac VARCHAR(25) references spasilac(korisnickoIme),
	sifAkcija VARCHAR(5) references akcija(sifAkcija),
	CONSTRAINT spasilacAkcija_pk PRIMARY KEY (korImeSpasilac, sifAkcija)
);

CREATE TABLE nacinSpasavanja (
	sifNacin VARCHAR(5) PRIMARY KEY,
	imeNacin VARCHAR(25) NOT NULL,
	intenzitet INTEGER NOT NULL,
	velicina INTEGER NOT NULL
);

CREATE TABLE zahtjev(
	sifAkcija VARCHAR(5) references akcija(sifakcija),
	sifStanica VARCHAR(5) references stanica(sifstanica),
	sifNacin VARCHAR(5) references nacinSpasavanja(sifnacin),
	CONSTRAINT zahtjev_pk PRIMARY KEY(sifakcija, sifstanica, sifnacin)
);

CREATE TABLE stanicaNacin(
	sifStanica VARCHAR(5) references stanica(sifstanica),
	sifNacin VARCHAR(5) references nacinSpasavanja(sifnacin),
	CONSTRAINT stanicaNacin_pk PRIMARY KEY(sifstanica, sifnacin)
);

INSERT INTO stanica(sifstanica, nazivstanica) VALUES ('00001', 'Makarska');
INSERT INTO stanica(sifstanica, nazivstanica) VALUES ('00002', 'Pozega');
INSERT INTO stanica(sifstanica, nazivstanica) VALUES ('00003', 'Sibenik');
INSERT INTO stanica(sifstanica, nazivstanica) VALUES ('00004', 'Rijeka');
INSERT INTO stanica(sifstanica, nazivstanica) VALUES ('00005', 'Zagreb');
INSERT INTO stanica VALUES ('00006', 'Split', null);
INSERT INTO stanica VALUES ('00007', 'Zadar', null);
INSERT INTO stanica VALUES ('00008', 'Dubrovnik', null);
INSERT INTO stanica VALUES ('00009', 'Osijek', null);
INSERT INTO stanica VALUES ('00010', 'Slavonski Brod', null);

INSERT INTO korisnik(korisnickoIme,lozinka, ime, prezime, brojMob, email, uloga, status) VALUES ('peroperic1','pero12345', 'Pero', 'Pericic', '09212345678', 'pero.peric@fer', 'Spasilac', 'Registriran');
INSERT INTO korisnik(korisnickoIme,lozinka, ime, prezime, brojMob, email, uloga, status) VALUES ('markomarkovic1','marko12345', 'Marko', 'Markovic', '09212345678', 'marko.markovic@fer', 'Spasilac', 'Registriran');

INSERT INTO spasilac(korisnickoIme, dostupan, sifStanica) VALUES('peroperic1', false, '00005');
INSERT INTO spasilac(korisnickoIme, dostupan, sifStanica) VALUES('markomarkovic1', false, '00006');

UPDATE stanica SET korImeVoditelj = 'peroperic1' WHERE nazivStanica = 'Zagreb';

--
--
--v1.1
--Umjesto tablice stanicanacin dodana tablica spasilacNacin
--Dodani triggeri koji automatski prave unos u tablicu spasilac/dispecer (ovisno o ulozi) nakon dodavanja registriranog korisnika
--Dodane ON UPDATE i ON DELETE akcije na strane kljuceve (to sam zaboravio dodati u prvoj verziji)
--
--

DROP TABLE stanicaNacin;

CREATE TABLE spasilacNacin(
	korImeSpasilac VARCHAR(25) references spasilac(korisnickoIme),
	sifNacin VARCHAR(5) references nacinSpasavanja(sifnacin),
	CONSTRAINT spasilacNacin_pk PRIMARY KEY(korImeSpasilac, sifnacin)
);

CREATE FUNCTION dodajSpasioca() RETURNS trigger AS
$$
	BEGIN
		IF NEW.korisnickoIme NOT IN (SELECT korisnickoIme FROM spasilac) THEN
			INSERT INTO spasilac(korisnickoIme, dostupan, sifStanica) VALUES(NEW.korisnickoIme, false, null);
		END IF;
		RETURN NEW;
	END;	
$$ LANGUAGE plpgsql;

CREATE TRIGGER dodaj_spasioca
AFTER INSERT OR UPDATE OF status, uloga ON korisnik
FOR EACH ROW
WHEN (NEW.status = 'Registriran' AND NEW.uloga = 'Spasilac')
EXECUTE PROCEDURE dodajSpasioca();

CREATE FUNCTION dodajDispecera() RETURNS trigger AS
$$
	BEGIN
		IF NEW.korisnickoIme NOT IN (SELECT korisnickoIme FROM dispecer) THEN
			INSERT INTO dispecer(korisnickoIme) VALUES(NEW.korisnickoIme);
		END IF;
		RETURN NEW;
	END;	
$$ LANGUAGE plpgsql;

CREATE TRIGGER dodaj_dispecera
AFTER INSERT OR UPDATE OF status, uloga ON korisnik
FOR EACH ROW
WHEN (NEW.status = 'Registriran' AND NEW.uloga = 'Dispecer')
EXECUTE PROCEDURE dodajDispecera();

ALTER TABLE korisnik DROP CONSTRAINT korisnik_status_check;
ALTER TABLE korisnik ADD CONSTRAINT korisnik_status_check CHECK(status = 'Zahtjev poslan' OR status = 'Registriran' OR status = 'Deaktiviran');

ALTER TABLE spasilac DROP CONSTRAINT spasilac_korisnickoime_fkey;
ALTER TABLE spasilac ADD CONSTRAINT spasilac_korisnickoime_fkey FOREIGN KEY(korisnickoIme) REFERENCES korisnik(korisnickoIme) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE dispecer DROP CONSTRAINT dispecer_korisnickoime_fkey;
ALTER TABLE dispecer ADD CONSTRAINT dispecer_korisnickoime_fkey FOREIGN KEY(korisnickoIme) REFERENCES korisnik(korisnickoIme) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE spasilac DROP CONSTRAINT spasilac_sifStanica_fkey;
ALTER TABLE spasilac ADD CONSTRAINT spasilac_sifStanica_fkey FOREIGN KEY(sifStanica) REFERENCES stanica(sifStanica) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE stanica DROP CONSTRAINT korImeVoditelj_fk;
ALTER TABLE stanica ADD CONSTRAINT stanica_korImeVoditelj_fkey FOREIGN KEY(korImeVoditelj) REFERENCES spasilac(korisnickoIme) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE akcija DROP CONSTRAINT akcija_korImeDispecer_fkey;
ALTER TABLE akcija ADD CONSTRAINT akcija_korImeDispecer_fkey FOREIGN KEY(korImeDispecer) REFERENCES dispecer(korisnickoIme) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE zadatak DROP CONSTRAINT zadatak_korImeDispecer_fkey;
ALTER TABLE zadatak ADD CONSTRAINT zadatak_korImeDispecer_fkey FOREIGN KEY(korImeDispecer) REFERENCES dispecer(korisnickoIme) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE zadatak DROP CONSTRAINT zadatak_korImeSpasilac_fkey;
ALTER TABLE zadatak ADD CONSTRAINT zadatak_korImeSpasilac_fkey FOREIGN KEY(korImeSpasilac) REFERENCES spasilac(korisnickoIme) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE spasilacAkcija DROP CONSTRAINT spasilacAkcija_korImeSpasilac_fkey;
ALTER TABLE spasilacAkcija ADD CONSTRAINT spasilacAkcija_korImeSpasilac_fkey FOREIGN KEY(korImeSpasilac) REFERENCES spasilac(korisnickoIme) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE spasilacAkcija DROP CONSTRAINT spasilacAkcija_sifakcija_fkey;
ALTER TABLE spasilacAkcija ADD CONSTRAINT spasilacAkcija_sifakcija_fkey FOREIGN KEY(sifakcija) REFERENCES akcija(sifakcija) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE zahtjev DROP CONSTRAINT zahtjev_sifakcija_fkey;
ALTER TABLE zahtjev ADD CONSTRAINT zahtjev_sifakcija_fkey FOREIGN KEY(sifakcija) REFERENCES akcija(sifakcija) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE zahtjev DROP CONSTRAINT zahtjev_sifstanica_fkey;
ALTER TABLE zahtjev ADD CONSTRAINT zahtjev_sifstanica_fkey FOREIGN KEY(sifstanica) REFERENCES stanica(sifstanica) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE zahtjev DROP CONSTRAINT zahtjev_sifnacin_fkey;
ALTER TABLE zahtjev ADD CONSTRAINT zahtjev_sifnacin_fkey FOREIGN KEY(sifnacin) REFERENCES nacinspasavanja(sifnacin) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE spasilacnacin DROP CONSTRAINT spasilacnacin_sifnacin_fkey;
ALTER TABLE spasilacnacin ADD CONSTRAINT spasilacnacin_sifnacin_fkey FOREIGN KEY(sifnacin) REFERENCES nacinspasavanja(sifnacin) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE spasilacnacin DROP CONSTRAINT spasilacnacin_korImeSpasilac_fkey;
ALTER TABLE spasilacnacin ADD CONSTRAINT spasilacnacin_korImeSpasilac_fkey FOREIGN KEY(korImeSpasilac) REFERENCES spasilac(korisnickoIme) ON UPDATE CASCADE ON DELETE CASCADE;

--
-- v1.1.1
-- Dodan admin kao uloga
--

ALTER TABLE korisnik DROP CONSTRAINT korisnik_uloga_check;
ALTER TABLE korisnik ADD CONSTRAINT korisnik_uloga_check CHECK(uloga = 'Spasilac' OR uloga = 'Dispecer' OR uloga = 'Admin');
INSERT into korisnik(korisnickoime, lozinka, ime, prezime, brojmob, email, uloga, status) VALUES('admin', 'admin', 'Admin', 'Admin', '0912345678', 'admin@hgsstracks.com', 'Admin', 'Registriran');

 --
 -- v1.1.2
 -- Dodan url slike u tablici korisnik
 --

 ALTER TABLE korisnik ADD urlslika VARCHAR(300);
 UPDATE korisnik SET urlslika = 'www.slika.com/slika1241656';
 ALTER TABLE korisnik ALTER COLUMN urlslika SET NOT NULL; 


--
-- v1.1.3
-- Promjena korisnik status check i lozinka
--
ALTER TABLE korisnik DROP CONSTRAINT korisnik_status_check;
ALTER TABLE korisnik ADD CONSTRAINT korisnik_status_check CHECK(status = 'Zahtjev_poslan' OR status = 'Registriran' OR status = 'Deaktiviran');
ALTER TABLE korisnik ALTER COLUMN lozinka type varchar(60);

--
-- v1.1.4
-- Dodan komentar na akciju i trenutna akcija spasioca
--
ALTER TABLE akcija ADD COLUMN komentar VARCHAR(100);
ALTER TABLE spasilac ADD COLUMN sifTrenutneAkcije VARCHAR(5) REFERENCES akcija(sifAkcija);

--
-- v1.1.5
-- Promjena akcija_status_check, dodan test dispecer
--
ALTER TABLE akcija DROP CONSTRAINT akcija_status_check;
ALTER TABLE akcija ADD CONSTRAINT akcija_status_check CHECK(status = 'U_tijeku' OR status = 'Zavrsena');
INSERT INTO korisnik(korisnickoime, lozinka, ime, prezime, brojmob, email, uloga, status, urlslika)
values ('dispecerTest', 'dispecer123', 'dispecer', 'dispeceric', '123', 'dispecer@hgss', 'Dispecer','Registriran', 'url');
--
-- v1.1.6
-- Duzi naziv zadatka
--
ALTER TABLE zadatak ALTER COLUMN nazivZadatak TYPE VARCHAR(50);
ALTER TABLE zadatak ADD COLUMN sifAkcija VARCHAR(5) NOT NULL REFERENCES akcija(sifAkcija);

--
-- v1.1.7
-- Dodani načini spašavanja
--
INSERT INTO nacinSpasavanja(sifNacin, imeNacin, intenzitet, velicina) VALUES(1, 'pješke', 4, 1);
INSERT INTO nacinSpasavanja(sifNacin, imeNacin, intenzitet, velicina) VALUES(2, 'bicikl', 4, 2);
INSERT INTO nacinSpasavanja(sifNacin, imeNacin, intenzitet, velicina) VALUES(3, 'pas', 5, 2);
INSERT INTO nacinSpasavanja(sifNacin, imeNacin, intenzitet, velicina) VALUES(4, 'dron', 2, 5);
INSERT INTO nacinSpasavanja(sifNacin, imeNacin, intenzitet, velicina) VALUES(5, 'auto', 3, 3);
INSERT INTO nacinSpasavanja(sifNacin, imeNacin, intenzitet, velicina) VALUES(6, 'brod', 3, 3);
INSERT INTO nacinSpasavanja(sifNacin, imeNacin, intenzitet, velicina) VALUES(7, 'helikopter', 1, 5);
INSERT INTO spasilacnacin(korimespasilac, sifnacin) values ('peroperic1', '1');

--
--v1.2.
-- Napunjena baza
--
INSERT INTO korisnik(korisnickoime, lozinka, ime, prezime, brojmob, email, uloga, status, urlslika)
VALUES ('stjepanmlakic', 'stjepan123', 'Stjepan', 'Mlakic', '0921234567', 'stjepan.mlakic@fer.hr', 'Dispecer', 'Registriran', 'url');
INSERT INTO korisnik(korisnickoime, lozinka, ime, prezime, brojmob, email, uloga, status, urlslika)
VALUES ('lovregusar', 'lovre123', 'Lovre', 'Gusar', '0911234567', 'lovre.gusar@fer.hr', 'Dispecer', 'Registriran', 'url');
INSERT INTO korisnik(korisnickoime, lozinka, ime, prezime, brojmob, email, uloga, status, urlslika)
VALUES ('bartolboras', 'bartol123', 'Bartol', 'Boras', '0931234567', 'bartol.boras@fer.hr', 'Dispecer', 'Registriran', 'url');
INSERT INTO korisnik(korisnickoime, lozinka, ime, prezime, brojmob, email, uloga, status, urlslika)
VALUES ('matejskrabic', 'matej123', 'Matej', 'Skrabic', '0941234567', 'matej.skrabic@fer.hr', 'Spasilac', 'Registriran', 'url');
INSERT INTO korisnik(korisnickoime, lozinka, ime, prezime, brojmob, email, uloga, status, urlslika)
VALUES ('karlokovac', 'karlo123', 'Karlo', 'Kovac', '0951234567', 'karlo.kovacr@fer.hr', 'Spasilac', 'Registriran', 'url');
INSERT INTO korisnik(korisnickoime, lozinka, ime, prezime, brojmob, email, uloga, status, urlslika)
VALUES ('zrinfrankokovacic', 'zrin123', 'Zrin Franko', 'Kovacic', '0961234567', 'zrinfranko.kovacic@fer.hr', 'Spasilac', 'Registriran', 'url');
INSERT INTO korisnik(korisnickoime, lozinka, ime, prezime, brojmob, email, uloga, status, urlslika)
VALUES ('miastojak', 'mia123', 'Mia', 'Stojak', '0971234567', 'mia.stojak@fer.hr', 'Spasilac', 'Registriran', 'url');
ALTER TABLE spasilac DROP CONSTRAINT spasilac_siftrenutneakcije_fkey;
ALTER TABLE spasilac ADD CONSTRAINT spasilac_siftrenutneakcije_fkey FOREIGN KEY (siftrenutneakcije) REFERENCES akcija(sifakcija) ON UPDATE CASCADE ON DELETE SET NULL;
delete from korisnik where korisnickoime = 'dispecerTest';
UPDATE spasilac SET sifstanica = '00005' WHERE korisnickoime = 'karlokovac' OR korisnickoime = 'zrinfrankokovacic';
UPDATE spasilac SET sifstanica = '00006' WHERE korisnickoime = 'matejskrabic' OR korisnickoime = 'miastojak';
ALTER TABLE akcija ALTER COLUMN nazivakcija TYPE VARCHAR(50);
INSERT INTO akcija VALUES ('00001', 'Akcija spasavanja planinara', 'Planinar zapeo', 'nema lokacije', 'stjepanmlakic', 'Zavrsena', 'nema komentara');
INSERT INTO akcija VALUES ('00002', 'Akcija spasavanja planinara 2', 'Planinar zapeo opet', 'nema lokacije', 'stjepanmlakic', 'U_tijeku', 'nema komentara');
INSERT INTO akcija VALUES ('00003', 'Akcija spasavanja 1', 'Spasavanje', 'nema lokacije', 'lovregusar', 'Zavrsena', 'nema komentara');
INSERT INTO akcija VALUES ('00004', 'Akcija spasavanja 2', 'Spasavanje', 'nema lokacije', 'lovregusar', 'U_tijeku', 'nema komentara');
INSERT INTO spasilacnacin VALUES ('peroperic1', 3);
INSERT INTO spasilacnacin VALUES ('peroperic1', 4);
INSERT INTO spasilacnacin VALUES ('peroperic1', 6);
INSERT INTO spasilacnacin VALUES ('markomarkovic1', 1);
INSERT INTO spasilacnacin VALUES ('markomarkovic1', 4);
INSERT INTO spasilacnacin VALUES ('markomarkovic1', 5);
INSERT INTO spasilacnacin VALUES ('markomarkovic1', 6);
INSERT INTO spasilacnacin VALUES ('markomarkovic1', 7);
INSERT INTO spasilacnacin VALUES ('miastojak', 2);
INSERT INTO spasilacnacin VALUES ('miastojak', 3);
INSERT INTO spasilacnacin VALUES ('miastojak', 4);
INSERT INTO spasilacnacin VALUES ('miastojak', 5);
INSERT INTO spasilacnacin VALUES ('matejskrabic', 1);
INSERT INTO spasilacnacin VALUES ('matejskrabic', 2);
INSERT INTO spasilacakcija VALUES ('miastojak', '00001');
INSERT INTO spasilacakcija VALUES ('miastojak', '00002');
INSERT INTO spasilacakcija VALUES ('miastojak', '00003');
INSERT INTO spasilacakcija VALUES ('miastojak', '00004');
INSERT INTO spasilacakcija VALUES ('peroperic1', '00001');
INSERT INTO spasilacakcija VALUES ('peroperic1', '00004');
INSERT INTO spasilacakcija VALUES ('markomarkovic1', '00002');
INSERT INTO spasilacakcija VALUES ('markomarkovic1', '00003');
INSERT INTO spasilacakcija VALUES ('markomarkovic1', '00004');
INSERT INTO spasilacakcija VALUES ('matejskrabic', '00001');
--
--v1.2.1
--Dodan trigger za spasioca i akciju
--
CREATE FUNCTION dodajSpasiocaNaAkciju() RETURNS trigger AS
$$
	BEGIN
		IF (NEW.korisnickoIme, NEW.sifTrenutneAkcije) NOT IN (SELECT korImeSpasilac, sifAkcija FROM spasilacAkcija) THEN
			INSERT INTO spasilacAkcija(korImeSpasilac, sifAkcija) VALUES(NEW.korisnickoIme, NEW.sifTrenutneAkcije);
		END IF;
		RETURN NEW;
	END;	
$$ LANGUAGE plpgsql;

CREATE TRIGGER dodaj_spasioca_na_akciju
AFTER INSERT OR UPDATE OF sifTrenutneAkcije ON spasilac
FOR EACH ROW
WHEN (NEW.sifTrenutneAkcije IS NOT NULL)
EXECUTE PROCEDURE dodajSpasiocaNaAkciju();
--
--v1.2.2
--Lokacije akcije i stanica
--
UPDATE akcija SET lokacija = null;
ALTER TABLE akcija ALTER COLUMN lokacija TYPE NUMERIC(7, 5) USING lokacija::numeric(7,5);
ALTER TABLE akcija RENAME COLUMN lokacija TO lokacijaDuzina;
ALTER TABLE akcija ADD COLUMN lokacijaSirina NUMERIC(7,5);
ALTER TABLE stanica ADD COLUMN lokacijaSirina NUMERIC(7,5);
ALTER TABLE stanica ADD COLUMN lokacijaDuzina NUMERIC(7,5);
ALTER TABLE spasilac ADD COLUMN lokacijaSirina NUMERIC(7,5);
ALTER TABLE spasilac ADD COLUMN lokacijaDuzina NUMERIC(7,5);
--
--v1.2.3.
--Trigger za zavrsene akcije
--
CREATE FUNCTION ukloniTrenutnuAkciju() RETURNS trigger AS
$$
	BEGIN
		UPDATE spasilac SET siftrenutneakcije = null, dostupan = true WHERE siftrenutneakcije = NEW.sifAkcija;
		RETURN NEW;
	END;	
$$ LANGUAGE plpgsql;

CREATE TRIGGER ukloni_trenutnu_akciju
AFTER INSERT OR UPDATE OF status ON akcija
FOR EACH ROW
WHEN (NEW.status = 'Zavrsena')
EXECUTE PROCEDURE ukloniTrenutnuAkciju();

DROP TRIGGER dodaj_spasioca_na_akciju ON spasilac;
DROP FUNCTION dodajSpasiocaNaAkciju;

CREATE FUNCTION dodajSpasiocaNaAkciju() RETURNS trigger AS
$$
	BEGIN
		IF (SELECT status FROM akcija WHERE sifAkcija = NEW.siftrenutneakcije) = 'Zavrsena' THEN
			RAISE EXCEPTION 'Spasilac se ne moze dodati na vec zavrsene akcije';
		ELSE
			IF (NEW.korisnickoIme, NEW.sifTrenutneAkcije) NOT IN (SELECT korImeSpasilac, sifAkcija FROM spasilacAkcija) THEN
				INSERT INTO spasilacAkcija(korImeSpasilac, sifAkcija) VALUES(NEW.korisnickoIme, NEW.sifTrenutneAkcije);
			END IF;
			NEW.dostupan = false;
		END IF;
		RETURN NEW;
	END;	
$$ LANGUAGE plpgsql;

CREATE TRIGGER dodaj_spasioca_na_akciju
BEFORE INSERT OR UPDATE OF sifTrenutneAkcije ON spasilac
FOR EACH ROW
WHEN (NEW.sifTrenutneAkcije IS NOT NULL)
EXECUTE PROCEDURE dodajSpasiocaNaAkciju();
--
--v1.2.4
--Jos jedan trigger :)
--
CREATE FUNCTION ukloniSpasiocaSAkcije() RETURNS trigger AS
$$
	BEGIN
		NEW.dostupan = true;
		RETURN NEW;
	END;	
$$ LANGUAGE plpgsql;

CREATE TRIGGER ukloni_spasioca_s_akcije
BEFORE UPDATE OF sifTrenutneAkcije ON spasilac
FOR EACH ROW
WHEN (NEW.sifTrenutneAkcije IS NULL AND NEW.sifTrenutneAkcije != OLD.sifTrenutneAkcije)
EXECUTE PROCEDURE ukloniSpasiocaSAkcije();
--
--v1.2.5
--Lokacija na zadatku, trigger za voditelja
--
ALTER TABLE zadatak ADD COLUMN lokacijaSirina NUMERIC(7,5);
ALTER TABLE zadatak ADD COLUMN lokacijaDuzina NUMERIC(7,5);

DROP TRIGGER ukloni_spasioca_s_akcije ON spasilac;
DROP FUNCTION ukloniSpasiocaSAkcije();

CREATE FUNCTION ukloniSpasiocaSAkcije() RETURNS trigger AS
$$
	BEGIN
		NEW.dostupan = true;
		RETURN NEW;
	END;	
$$ LANGUAGE plpgsql;

CREATE TRIGGER ukloni_spasioca_s_akcije
BEFORE UPDATE OF sifTrenutneAkcije ON spasilac
FOR EACH ROW
WHEN (NEW.sifTrenutneAkcije IS NULL AND NEW.sifTrenutneAkcije IS DISTINCT FROM OLD.sifTrenutneAkcije)
EXECUTE PROCEDURE ukloniSpasiocaSAkcije();

CREATE FUNCTION dodajVoditeljaStanice() RETURNS trigger AS
$$
	BEGIN
		IF (TG_OP = 'INSERT' OR NEW.korimevoditelj IS DISTINCT FROM OLD.korimevoditelj) THEN
			IF (SELECT sifStanica FROM spasilac WHERE korisnickoime = NEW.korimevoditelj) != NEW.sifstanica THEN
				UPDATE spasilac SET sifstanica = NEW.sifstanica WHERE korisnickoime = NEW.korimevoditelj;
			END IF;
		END IF;
		RETURN NEW;
	END;	
$$ LANGUAGE plpgsql;

CREATE TRIGGER dodaj_voditelja_stanice
AFTER INSERT OR UPDATE OF korimevoditelj ON stanica
FOR EACH ROW
EXECUTE PROCEDURE dodajVoditeljaStanice();

--
--v1.3
--Tablice za komentar i postaju na karti i u akciju dodana informacija je li osoba pronađena
--
ALTER TABLE akcija ADD COLUMN osobaPronadena BOOLEAN DEFAULT false;
CREATE TABLE postaja(
	sifPostaja VARCHAR(5) PRIMARY KEY,
	sifAkcija VARCHAR(5) REFERENCES akcija(sifakcija) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
	nazivPostaja VARCHAR(50) NOT NULL,
	lokacijaSirina NUMERIC(7,5),
	lokacijaDuzina NUMERIC(7,5)
);
CREATE TABLE komentar(
	sifKomentar VARCHAR(5) PRIMARY KEY,
	korImeSpasilac VARCHAR(25) REFERENCES spasilac(korisnickoime) NOT NULL,
	sifAkcija VARCHAR(5) REFERENCES akcija(sifakcija) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
	komentar VARCHAR(200) NOT NULL,
	lokacijaSirina NUMERIC(7,5),
	lokacijaDuzina NUMERIC(7,5)
);

--
--v1.3.1.
--Punjenje baze
--
UPDATE stanica SET lokacijaSirina=45.86492, lokacijaDuzina=15.97902 WHERE nazivStanica='Zagreb';
UPDATE stanica SET lokacijaSirina=45.35132, lokacijaDuzina=17.68036 WHERE nazivStanica='Pozega';
UPDATE stanica SET lokacijaSirina=43.74292, lokacijaDuzina=15.88435 WHERE nazivStanica='Sibenik';
UPDATE stanica SET lokacijaSirina=45.31991, lokacijaDuzina=14.47179 WHERE nazivStanica='Rijeka';
UPDATE stanica SET lokacijaSirina=44.11858, lokacijaDuzina=15.23663 WHERE nazivStanica='Zadar';
UPDATE stanica SET lokacijaSirina=42.64769, lokacijaDuzina=18.07712 WHERE nazivStanica='Dubrovnik';
UPDATE stanica SET lokacijaSirina=43.47160, lokacijaDuzina=16.65142 WHERE nazivStanica='Osijek';
UPDATE stanica SET lokacijaSirina=43.36235, lokacijaDuzina=16.93284 WHERE nazivStanica='Makarska';
UPDATE stanica SET lokacijaSirina=45.16878, lokacijaDuzina=18.00432 WHERE nazivStanica='Slavonski Brod';
UPDATE stanica SET lokacijaSirina=43.51965, lokacijaDuzina=16.45472 WHERE nazivStanica='Split';

INSERT INTO zadatak VALUES('00001', 'Dođi do lokacije', 'stjepanmlakic', 'markomarkovic1', null, '00002', 45.66492, 15.77902);
INSERT INTO zadatak VALUES('00002', 'Postavi privremenu postaju', 'lovregusar', 'peroperic1', null, '00004', 45.82345, 15.83487);
INSERT INTO zadatak VALUES('00003', 'Postavi privremenu postaju', 'stjepanmlakic', 'markomarkovic1', null, '00002', 45.52376, 15.64512);
INSERT INTO postaja VALUES('00001', '00002', 'Privremena postaja 1', 45.52376, 15.64512);
INSERT INTO komentar VALUES('00001', 'markomarkovic1', '00002', 'Ne mogu proći', 45.32487, 15.90765);
INSERT INTO zahtjev VALUES('00002', '00005', 1);
INSERT INTO zahtjev VALUES('00002', '00005', 2);
INSERT INTO zahtjev VALUES('00002', '00005', 4);
INSERT INTO zahtjev VALUES('00002', '00005', 5);
INSERT INTO zahtjev VALUES('00002', '00005', 7);
UPDATE spasilac SET siftrenutneakcije = '00002' WHERE korisnickoime = 'markomarkovic1';
UPDATE spasilac SET dostupan = true WHERE korisnickoime = 'matejskrabic' OR korisnickoime = 'karlokovac' OR korisnickoime = 'zrinfrankokovacic';

--
-- v1.3.2.
-- Automatska sifra zadatka
--
DROP TABLE zadatak;
CREATE TABLE zadatak (
	sifZadatak SERIAL PRIMARY KEY,
	nazivZadatak VARCHAR(50) NOT NULL,
	korImeDispecer VARCHAR(25) REFERENCES dispecer(korisnickoIme) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
	korImeSpasilac VARCHAR(25) REFERENCES spasilac(korisnickoIme) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
	komentar VARCHAR(100),
	sifAkcija VARCHAR(5) NOT NULL REFERENCES akcija(sifAkcija) ON UPDATE CASCADE ON DELETE CASCADE,
	lokacijaSirina NUMERIC(7,5),
	lokacijaDuzina NUMERIC(7,5),
	pocetnaLokacijaSirina NUMERIC(7,5),
	pocetnaLokacijaDuzina NUMERIC(7,5)
);
INSERT INTO zadatak VALUES(DEFAULT, 'Dođi do lokacije', 'stjepanmlakic', 'markomarkovic1', null, '00002', 45.66492, 15.77902, null, null);
INSERT INTO zadatak VALUES(DEFAULT, 'Postavi privremenu postaju', 'lovregusar', 'peroperic1', null, '00004', 45.82345, 15.83487, null, null);
INSERT INTO zadatak VALUES(DEFAULT, 'Postavi privremenu postaju', 'stjepanmlakic', 'markomarkovic1', null, '00002', 45.52376, 15.64512, null, null);
INSERT INTO zadatak VALUES(DEFAULT, 'Prođi rutom', 'stjepanmlakic', 'markomarkovic1', null, '00002', 45.52376, 15.64512, 45.55682, 16.12453);

-- v1.3.3.
-- Automatske sifre za postaju i komentar
DROP TABLE postaja;
CREATE TABLE postaja(
	sifPostaja SERIAL PRIMARY KEY,
	sifAkcija VARCHAR(5) REFERENCES akcija(sifakcija) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
	nazivPostaja VARCHAR(50) NOT NULL,
	lokacijaSirina NUMERIC(7,5),
	lokacijaDuzina NUMERIC(7,5)
);
DROP TABLE komentar;
CREATE TABLE komentar(
	sifKomentar SERIAL PRIMARY KEY,
	korImeSpasilac VARCHAR(25) REFERENCES spasilac(korisnickoime) NOT NULL,
	sifAkcija VARCHAR(5) REFERENCES akcija(sifakcija) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
	komentar VARCHAR(200) NOT NULL,
	lokacijaSirina NUMERIC(7,5),
	lokacijaDuzina NUMERIC(7,5)
);

-- v1.3.3.
-- Dodane profilne slike i promjenjeni nazivi nacina spasavanja
update korisnik set urlslika='https://firebasestorage.googleapis.com/v0/b/hgsstracks.appspot.com/o/images%2FGusar.jpg?alt=media&token=e4d45bc1-eb08-4dfc-8fdd-ce99520f7480'
where korisnickoime='lovregusar';
update korisnik set urlslika='https://firebasestorage.googleapis.com/v0/b/hgsstracks.appspot.com/o/images%2Fadmin.jpg?alt=media&token=1e282333-141a-4acd-9058-f1eac1417bfc' where korisnickoime='admin';
update korisnik
set urlslika='https://firebasestorage.googleapis.com/v0/b/hgsstracks.appspot.com/o/images%2Fja.jpg?alt=media&token=f050948c-62e0-487e-add2-ea8340003ac3'
where korisnickoime='matejskrabic';
update korisnik
set urlslika='https://firebasestorage.googleapis.com/v0/b/hgsstracks.appspot.com/o/images%2FKarlo.jpg?alt=media&token=bdf30b43-2f06-48bf-8ac8-8714e7805400'
where korisnickoime='karlokovac';
update korisnik
set urlslika='https://firebasestorage.googleapis.com/v0/b/hgsstracks.appspot.com/o/images%2FMia.jfif?alt=media&token=86bd738c-0b03-4972-ad85-6ee36afa770f'
where korisnickoime='miastojak';
update korisnik
set urlslika='https://firebasestorage.googleapis.com/v0/b/hgsstracks.appspot.com/o/images%2FBartol.jpg?alt=media&token=682f7311-5db4-4065-aab4-9220895311a8'
where korisnickoime='bartolboras';
update korisnik
set urlslika='https://firebasestorage.googleapis.com/v0/b/hgsstracks.appspot.com/o/images%2FZrin.jpg?alt=media&token=4aed9f6f-a3c7-4e89-997c-98e42d9e76c5'
where korisnickoime='zrinfrankokovacic';
update korisnik
set urlslika='https://firebasestorage.googleapis.com/v0/b/hgsstracks.appspot.com/o/images%2FStjepan.jpg?alt=media&token=73036569-f9f4-45fe-8691-5b7122b9c4b6'
where korisnickoime='stjepanmlakic';

UPDATE nacinSpasavanja
SET imenacin = 'Pješke' WHERE imenacin = 'pješke';
UPDATE nacinSpasavanja
SET imenacin = 'Bicikl' WHERE imenacin = 'bicikl';
UPDATE nacinSpasavanja
SET imenacin = 'Pas' WHERE imenacin = 'pas';
UPDATE nacinSpasavanja
SET imenacin = 'Dron' WHERE imenacin = 'dron';
UPDATE nacinSpasavanja
SET imenacin = 'Auto' WHERE imenacin = 'auto';
UPDATE nacinSpasavanja
SET imenacin = 'Brod' WHERE imenacin = 'brod';
UPDATE nacinSpasavanja
SET imenacin = 'Helikopter' WHERE imenacin = 'helikopter';