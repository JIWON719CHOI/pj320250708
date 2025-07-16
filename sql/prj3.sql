CREATE TABLE board
(
    id          INT AUTO_INCREMENT     NOT NULL,
    title       VARCHAR(300)           NOT NULL,
    content     VARCHAR(10000)         NOT NULL,
    author      VARCHAR(255)           NOT NULL,
    inserted_at datetime DEFAULT NOW() NOT NULL,
    CONSTRAINT pk_board PRIMARY KEY (id),
    FOREIGN KEY (author) REFERENCES member (email)
);

CREATE TABLE member
(
    email       VARCHAR(255)           NOT NULL,
    password    VARCHAR(255)           NOT NULL,
    nick_name   VARCHAR(255) UNIQUE    NOT NULL,
    info        VARCHAR(3000)          NULL,
    inserted_at datetime DEFAULT NOW() NOT NULL,
    CONSTRAINT pk_member PRIMARY KEY (email)
);

CREATE TABLE auth
(
    member_email VARCHAR(255) NOT NULL,
    auth_name    VARCHAR(255) NOT NULL,
    PRIMARY KEY (member_email, auth_name),
    FOREIGN KEY (member_email) REFERENCES member (email)
);

CREATE TABLE comment
(
    id          INT AUTO_INCREMENT NOT NULL,
    board_id    INT                NOT NULL,
    author      VARCHAR(255)       NOT NULL,
    comment     VARCHAR(2000)      NOT NULL,
    inserted_at datetime           NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_comment PRIMARY KEY (id),
    FOREIGN KEY (author) REFERENCES member (email),
    FOREIGN KEY (board_id) REFERENCES board (id)
);

CREATE TABLE board_like
(
    board_id     INT          NOT NULL,
    member_email VARCHAR(255) NOT NULL,
    PRIMARY KEY (board_id, member_email),
    FOREIGN KEY (board_id) REFERENCES board (id),
    FOREIGN KEY (member_email) REFERENCES member (email)
);

CREATE TABLE board_file
(
    board_id INT          NOT NULL,
    name     VARCHAR(300) NOT NULL,
    PRIMARY KEY (board_id, name),
    FOREIGN KEY (board_id) REFERENCES board (id)
);

INSERT INTO member (email, nick_name, password, inserted_at)
VALUES ('admin@email.com', 'admin', '1234', NOW());

INSERT INTO auth
    (member_email, auth_name)
VALUES ('admin@email.com', 'admin');

UPDATE member
SET password = '$2a$10$gdx4VSoqzsQ.AOHLIfbr2..zcar8fELPhWhuNiepTQns9GXi7h93u'
WHERE email = 'admin@email.com';



