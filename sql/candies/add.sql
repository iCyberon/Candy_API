INSERT INTO candies (description, cost, price, stock)
VALUES($1, $2, $3, $4) RETURNING *;