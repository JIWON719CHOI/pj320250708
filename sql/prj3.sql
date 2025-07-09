CREATE TABLE board
(
    id          INT AUTO_INCREMENT     NOT NULL,
    title       VARCHAR(300)           NOT NULL,
    content     VARCHAR(10000)         NOT NULL,
    author      VARCHAR(100)           NOT NULL,
    inserted_at datetime DEFAULT NOW() NOT NULL,
    CONSTRAINT pk_board PRIMARY KEY (id)
);

ALTER TABLE board
    MODIFY COLUMN content TEXT NOT NULL;

ALTER TABLE board
    MODIFY COLUMN title VARCHAR(200) NOT NULL;

ALTER TABLE board
    MODIFY COLUMN author VARCHAR(50) NOT NULL;


