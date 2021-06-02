USE [master]
GO
/****** Object:  Database [BarberShop]    Script Date: 02/06/2021 04:01:49 ******/
CREATE DATABASE [BarberShop]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'BarberShop', FILENAME = N'C:\Users\Matan\BarberShop.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'BarberShop_log', FILENAME = N'C:\Users\Matan\BarberShop_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [BarberShop] SET COMPATIBILITY_LEVEL = 130
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [BarberShop].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [BarberShop] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [BarberShop] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [BarberShop] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [BarberShop] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [BarberShop] SET ARITHABORT OFF 
GO
ALTER DATABASE [BarberShop] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [BarberShop] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [BarberShop] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [BarberShop] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [BarberShop] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [BarberShop] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [BarberShop] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [BarberShop] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [BarberShop] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [BarberShop] SET  DISABLE_BROKER 
GO
ALTER DATABASE [BarberShop] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [BarberShop] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [BarberShop] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [BarberShop] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [BarberShop] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [BarberShop] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [BarberShop] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [BarberShop] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [BarberShop] SET  MULTI_USER 
GO
ALTER DATABASE [BarberShop] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [BarberShop] SET DB_CHAINING OFF 
GO
ALTER DATABASE [BarberShop] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [BarberShop] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [BarberShop] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [BarberShop] SET QUERY_STORE = OFF
GO
USE [BarberShop]
GO
ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
GO
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
GO
USE [BarberShop]
GO
/****** Object:  Table [dbo].[Clients]    Script Date: 02/06/2021 04:01:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Clients](
	[ClientID] [int] IDENTITY(1,1) NOT NULL,
	[UserName] [varchar](50) NOT NULL,
	[FirstName] [varchar](50) NOT NULL,
	[password] [varchar](50) NOT NULL,
 CONSTRAINT [PK_Clients] PRIMARY KEY CLUSTERED 
(
	[ClientID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ScheduleClients]    Script Date: 02/06/2021 04:01:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ScheduleClients](
	[ScheduleID] [int] IDENTITY(1,1) NOT NULL,
	[ClientID] [int] NOT NULL,
	[ScheduleTime] [datetime] NOT NULL,
	[RegisteredRecord] [datetime] NOT NULL,
 CONSTRAINT [PK_ScheduleClients] PRIMARY KEY CLUSTERED 
(
	[ScheduleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Clients] ON 
GO
INSERT [dbo].[Clients] ([ClientID], [UserName], [FirstName], [password]) VALUES (2, N'matan1346', N'Matan', N'12345')
GO
INSERT [dbo].[Clients] ([ClientID], [UserName], [FirstName], [password]) VALUES (1002, N'adi', N'Adi', N'12345')
GO
INSERT [dbo].[Clients] ([ClientID], [UserName], [FirstName], [password]) VALUES (1003, N'adi2', N'asdfasf', N'11111')
GO
INSERT [dbo].[Clients] ([ClientID], [UserName], [FirstName], [password]) VALUES (1004, N'test1', N'Matan Omesi', N'123')
GO
SET IDENTITY_INSERT [dbo].[Clients] OFF
GO
SET IDENTITY_INSERT [dbo].[ScheduleClients] ON 
GO
INSERT [dbo].[ScheduleClients] ([ScheduleID], [ClientID], [ScheduleTime], [RegisteredRecord]) VALUES (14, 1004, CAST(N'2021-06-09T13:40:00.000' AS DateTime), CAST(N'2021-06-01T04:35:39.517' AS DateTime))
GO
INSERT [dbo].[ScheduleClients] ([ScheduleID], [ClientID], [ScheduleTime], [RegisteredRecord]) VALUES (15, 2, CAST(N'1970-01-01T10:20:00.000' AS DateTime), CAST(N'2021-06-01T04:45:06.947' AS DateTime))
GO
INSERT [dbo].[ScheduleClients] ([ScheduleID], [ClientID], [ScheduleTime], [RegisteredRecord]) VALUES (17, 1002, CAST(N'2021-06-18T11:20:00.000' AS DateTime), CAST(N'2021-06-02T03:15:57.220' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[ScheduleClients] OFF
GO
ALTER TABLE [dbo].[ScheduleClients]  WITH CHECK ADD FOREIGN KEY([ClientID])
REFERENCES [dbo].[Clients] ([ClientID])
GO
/****** Object:  StoredProcedure [dbo].[ClientExist]    Script Date: 02/06/2021 04:01:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ClientExist] @UserName varchar(50)
AS
SELECT 1 FROM Clients WHERE UserName = @UserName

GO
/****** Object:  StoredProcedure [dbo].[ClientLogin]    Script Date: 02/06/2021 04:01:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ClientLogin] @UserName varchar(50), @Password nvarchar(50)
AS
SELECT ClientID, UserName, FirstName FROM Clients WHERE UserName = @UserName AND password = @Password

GO
/****** Object:  StoredProcedure [dbo].[ClientRegister]    Script Date: 02/06/2021 04:01:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ClientRegister] @UserName varchar(50), @Password varchar(50), @FirstName varchar(50)
AS
INSERT INTO Clients (UserName, FirstName, password) VALUES(@UserName, @FirstName, @Password);


GO
/****** Object:  StoredProcedure [dbo].[IsScheduleBelongsToClient]    Script Date: 02/06/2021 04:01:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[IsScheduleBelongsToClient] @ScheduleID int, @ClientID int
AS
SELECT 1 FROM ScheduleClients WHERE ScheduleID = @ScheduleID AND ClientID = @ClientID;

GO
/****** Object:  StoredProcedure [dbo].[IsScheduleTimeAvialable]    Script Date: 02/06/2021 04:01:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[IsScheduleTimeAvialable]  
(  
      @ScheduleTime DATETIME  
)  
AS  
DECLARE @ResultValue int  
IF EXISTS  
    (  
          SELECT 1 FROM ScheduleClients  
          WHERE ScheduleTime = @ScheduleTime  
        )  
     BEGIN  
         RETURN 4 --  ALREADY_TAKEN
     END  
ELSE  
      BEGIN  
           RETURN 0 -- OK
     END  
GO
/****** Object:  StoredProcedure [dbo].[ScheduleDelete]    Script Date: 02/06/2021 04:01:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ScheduleDelete] @ScheduleID int
AS
DELETE FROM ScheduleClients WHERE ScheduleID = @ScheduleID

GO
/****** Object:  StoredProcedure [dbo].[ScheduleEdit]    Script Date: 02/06/2021 04:01:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ScheduleEdit] @scheduleID int, @scheduleTime datetime 
AS

 DECLARE @returnValue INT
 EXEC @returnValue = IsScheduleTimeAvialable @scheduleTime

 IF @returnValue = 0
	BEGIN
		UPDATE ScheduleClients SET ScheduleTime = @scheduleTime, RegisteredRecord = GETDATE() WHERE ScheduleID = @scheduleID;
	END
RETURN @returnValue

GO
/****** Object:  StoredProcedure [dbo].[ScheduleList]    Script Date: 02/06/2021 04:01:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ScheduleList]
AS
SELECT s.ScheduleID, c.ClientID, s.ScheduleTime, s.RegisteredRecord, c.UserName, c.FirstName FROM ScheduleClients  s
	INNER JOIN Clients c ON c.ClientID = s.ClientID;

GO
/****** Object:  StoredProcedure [dbo].[ScheduleRegister]    Script Date: 02/06/2021 04:01:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ScheduleRegister] @ClientID int, @scheduleTime datetime
AS

 DECLARE @returnValue INT
 EXEC @returnValue = IsScheduleTimeAvialable @scheduleTime;

 IF @returnValue = 0
	BEGIN
		INSERT INTO ScheduleClients (ClientID, ScheduleTime, RegisteredRecord) VALUES(@ClientID, @scheduleTime, GETDATE());
	END
RETURN @returnValue

GO
USE [master]
GO
ALTER DATABASE [BarberShop] SET  READ_WRITE 
GO
