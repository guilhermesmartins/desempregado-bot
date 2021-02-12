use thirtyfour::prelude::*;
use mini_redis::{ client, Result };
use tokio;


#[tokio::main]
pub async fn browse_wikipedia() -> Result<()> {
    let mut browser = DesiredCapabilities::chrome();
    browser.add_chrome_arg("--enable-automation")?;
    
    let page = WebDriver::new("http://localhost:4444/wd/hub", &browser).await?;

    page.get("https://br.indeed.com/empregos-de-Desenvolvedor-Web-em-Remoto").await?;

    let jobs = page.find_element(By::ClassName(".jobsearch-SerpJobCard")).await?;

    println!("{}", jobs);
    //let jobs = tab.find_elements(".jobsearch-SerpJobCard");

    
    Ok(())
}