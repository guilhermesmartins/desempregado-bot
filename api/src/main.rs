use thirtyfour::prelude::*;
use mini_redis::{ client, Result };
use tokio;
mod pages;

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
        println!("{:?}\n", job);
    }

    //let jobs = tab.find_elements(".jobsearch-SerpJobCard");

    
    Ok(())
}