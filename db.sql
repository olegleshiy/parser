CREATE TABLE finance (
    id INT(6) AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(350) NOT NULL,
    link VARCHAR(350) NOT NULL,
    category VARCHAR(300),
    description MEDIUMTEXT,
    image VARCHAR(300),
    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

CREATE TABLE entertainment (
    id INT(6) AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(350) NOT NULL,
    link VARCHAR(350) NOT NULL,
    category VARCHAR(300),
    description MEDIUMTEXT,
    image VARCHAR(300),
    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
