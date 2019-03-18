BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined ) values ('Jessie','a@a.com', 5 ,'2018-01-01');
INSERT into login (hash, email ) values ('$2a$10$eW9YiXhddhPuvHxyGaf2WeRlO34LOKvN.xfj9eAfoc8ZiW9cM5zfi','a@a.com');

COMMIT;
