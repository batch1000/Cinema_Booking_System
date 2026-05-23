using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CinemaBookingSystem.Migrations
{
    public partial class FixShowTime2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ShowTime",
                table: "ShowTime");

            migrationBuilder.AddColumn<Guid>(
                name: "ShowTimeID",
                table: "ShowTime",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_ShowTime",
                table: "ShowTime",
                column: "ShowTimeID");

            migrationBuilder.CreateIndex(
                name: "IX_ShowTime_MovieID",
                table: "ShowTime",
                column: "MovieID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ShowTime",
                table: "ShowTime");

            migrationBuilder.DropIndex(
                name: "IX_ShowTime_MovieID",
                table: "ShowTime");

            migrationBuilder.DropColumn(
                name: "ShowTimeID",
                table: "ShowTime");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ShowTime",
                table: "ShowTime",
                columns: new[] { "MovieID", "RoomID" });
        }
    }
}
