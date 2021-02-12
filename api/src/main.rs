use thirtyfour::prelude::*;
use mini_redis::{ client, Result };
use std::fmt;

use tokio;
mod pages;

struct IndeedJob {
    title: String,
    company: String,
    place: String,
    date: String,
    
}

#[tokio::main]
async fn main() -> color_eyre::Result<()> {
    color_eyre::install();

    let mut browser = DesiredCapabilities::chrome();
    browser.add_chrome_arg("--enable-automation")?;
    browser.add_chrome_arg("--headless")?;
    
    let page = WebDriver::new("http://localhost:4444/wd/hub", &browser).await?;

    page.get("https://br.indeed.com/empregos-de-Desenvolvedor-Web-em-Remoto").await?;

    let jobs = page.find_elements(By::ClassName("jobsearch-SerpJobCard")).await?;

    for job in jobs {
        let title = job
            .find_element(By::ClassName("jobtitle"))
            .await?
            .get_attribute("title")
            .await?
            .unwrap();

        let company = job
            .find_element(By::ClassName("company"))
            .await?
            .text()
            .await?;

        let place = job
            .find_element(By::ClassName("location"))
            .await?
            .text()
            .await?;

        let date = job
            .find_element(By::ClassName("date"))
            .await?
            .text()
            .await?;

        let link = job
        .find_element(By::ClassName("jobtitle"))
        .await?
        .get_attribute("href")
        .await?
        .unwrap();

        //SOme and None
        // let salary = job
        // .find_element(By::ClassName("salaryText"))
        // .await?
        // .text()
        // .await?;
    }
    
    Ok(())
}