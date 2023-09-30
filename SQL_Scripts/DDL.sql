/******************************************
**        CSCI 467 Group Project         **
**                                       **
**      This Script Will Create the      **  
**   tables we use in our e-commerce     **
**   web application.                    **
**                                       **
** CREATED BY: Angelo LeDonne (Z1920784) **
**             Caleb Pastsch             **
**             Alan Garcia               **
**             Fabian Cornejo            ** 
**                                       **
******************************************/
DROP TABLE QuoteLine;
DROP TABLE Quote;
DROP TABLE Customer;
DROP TABLE SalesAssoc;


CREATE TABLE SalesAssoc(
        ID             VARCHAR(10)   NOT NULL PRIMARY KEY,
        Name           VARCHAR(50)   NOT NULL,
        Password       VARCHAR(12)   NOT NULL,
        SalesCommision DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
        Address        VARCHAR(60)   NOT NULL
);


CREATE TABLE Customer(

        ID     VARCHAR(10)   NOT NULL PRIMARY KEY,
        FName  VARCHAR(50)   NOT NULL,
        LName  VARCHAR(50)   NOT NULL,
        Addrs  VARCHAR(255)  NOT NULL,
        Email  VARCHAR(60)   NOT NULL   

); 

CREATE TABLE Quote(

        ID        INT            NOT NULL AUTO_INCREMENT PRIMARY KEY,
        AssocID   VARCHAR(10)    NOT NULL,
        CustID    VARCHAR(10)    NOT NULL,
        QuoteDate DATE           NOT NULL DEFAULT now(),
        Status    CHAR(1)        NOT NULL DEFAULT 'F',
        Total     DECIMAL(15,2)  NOT NULL DEFAULT 0.00,
        Discount  DECIMAL(3,2)   NOT NULL DEFAULT 0.00,

        FOREIGN KEY(CustID)  REFERENCES Customer(ID),
        FOREIGN KEY(AssocID) REFERENCES SalesAssoc(ID)
);

CREATE TABLE QuoteLine(

        ID       INT           NOT NULL PRIMARY KEY,
        QuoteID  INT           NOT NULL,
        Secret   CHAR(1)       NOT NULL DEFAULT 'N',     
        RowDesc  VARCHAR(255)  NOT NULL,
        RowQyt   INT           NOT NULL DEFAULT 1,
        RowPrice DECIMAL(10,2) NOT NULL,

        FOREIGN KEY(QuoteID) REFERENCES Quote(ID)
);

