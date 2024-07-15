import leifSelander from "../assets/pictures/leif-selander-portratt.webp";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="page-container">
      <div className="about-container">
        <div className="about-info">
          <h1 style={{ textAlign: "center" }}>Leif Selander</h1>
          <div style={{ marginBottom: "1em" }} className="about-img-container">
            <img className="about-img" src={leifSelander} alt="" />
          </div>

          <h2>About</h2>
          <p style={{ marginBottom: "1em" }}>
            Leif Selander är född i Örnsköldsvik och bor nu i Eskilstuna tillsammans med sin familj. Intresset för
            historia föddes tidigt i hans liv. Historia, religion, konst och gymnastik tillhörde de ämnen med högst
            betyg. Intresset för antikens historia ledde honom till arbetet som rundtursguide i Turkiet. Där besöktes
            Efesos, Troja, Bursa och Istanbul + många antika städer. Tiden i Turkiet föddes idén om att skriva en roman
            om det romerska imperiet. Dock hittades ingen del av historien som var tillräckligt intressant. Allt var
            redan skrivet av andra författare. Det var inte förrän många år senare efter att ha läst Mats G Larsson bok
            ”Väringar” som idén föddes om det som skulle mynna ut i boken ”Svekens tid”, del ett i trilogin
            ”Väringasagan”. Berättelsen om nordmännen som färdades genom Gårdarike och till slut bildade det mytomspunna
            väringagardet. I den senaste serien ”Den hårda vägen” fortsätter han berättelsen om vikingar i österled och
            i väringagardet. Den romerska kejsarens elit- och livaktsgarde.
          </p>

          <h2>More about Leif Selander</h2>

          <div style={{ marginBottom: "1em" }} className="about-link">
            <Link to="https://www.radioovik.se/leif-selander/">Semesterprat i Radio Övik</Link>
          </div>

          <h2>Podcasts</h2>

          <div className="about-link">
            <Link to="https://www.ilikeradio.se/podcasts/var-blodiga-historia/18406/">Vår blodiga historia</Link>
          </div>
          <div className="about-link">
            <Link to="https://mariasbokhylla.wordpress.com/2018/03/30/forfattarintervju-leif-selander/">
              Författarintervju - Leif Selander
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
