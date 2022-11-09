CREATE TABLE
    `academind_node_express_udemy_mysql`.`products` (
        `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        `title` VARCHAR(255) NOT NULL,
        `price` DOUBLE NOT NULL,
        `description` VARCHAR(255) NOT NULL,
        `imageUrl` VARCHAR(255) NOT NULL,
        PRIMARY KEY (`id`),
        UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE
    );

INSERT INTO
    `academind_node_express_udemy_mysql`.`products` (`title`, `price`, `description`, `imageUrl`)
VALUES
    (
        'Book',
        '12.99',
        'A super book',
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.2Azr155M0q4BpJdrvGyywgHaF_%26pid%3DApi&f=1&ipt=602a76eca07761186cb906c383dab7151ca67afc3526f03f1649a1e90918711f&ipo=images'
    );

UPDATE
    `academind_node_express_udemy_mysql`.`products`
SET
    `price` = '30.99'
WHERE
    (`id` = '2');