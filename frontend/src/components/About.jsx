import leifSelander from "../assets/pictures/leif-selander-portratt.webp";

export default function About() {
  return (
    <div className="p-6 sm:pt-6 sm:px-6 xl:px-0">
      <div className="flex flex-col sm:flex-row gap-6 mb-2">
        <div className="flex-shrink-0">
          <img className=" w-72 h-72 rounded-lg " src={leifSelander} alt="" />
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-2">Leif Selander</h1>

          <p className="pb-4">
            Leif Selander är född i Örnsköldsvik och bor nu i Eskilstuna
            tillsammans med sin familj. Intresset för historia föddes tidigt i
            hans liv. Historia, religion, konst och gymnastik tillhörde de ämnen
            med högst betyg. Intresset för antikens historia ledde honom till
            arbetet som rundtursguide i Turkiet. Där besöktes Efesos, Troja,
            Bursa och Istanbul + många antika städer. Tiden i Turkiet föddes
            idén om att skriva en roman om det romerska imperiet. Dock hittades
            ingen del av historien som var tillräckligt intressant. Allt var
            redan skrivet av andra författare. Det var inte förrän många år
            senare efter att ha läst Mats G Larsson bok ”Väringar” som idén
            föddes om det som skulle mynna ut i boken ”Svekens tid”, del ett i
            trilogin ”Väringasagan”. Berättelsen om nordmännen som färdades
            genom Gårdarike och till slut bildade det mytomspunna väringagardet.
            I den senaste serien ”Den hårda vägen” fortsätter han berättelsen om
            vikingar i österled och i väringagardet. Den romerska kejsarens
            elit- och livaktsgarde.
          </p>
        </div>
      </div>

      <div className="pb-4">
        <h2 className="text-xl font-bold">Mer om Leif Selander</h2>
        <a
          className="text-purple-800 font-bold hover:underline mb-4 transform duration-300"
          href={`https://www.radioovik.se/leif-selander/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Semesterprat i Radio Övik
        </a>
      </div>

      <div className="flex flex-col">
        <h2 className="text-xl font-bold">Podcasts</h2>
        <a
          className="text-purple-800 font-bold hover:underline transform duration-300"
          href={`https://www.ilikeradio.se/podcasts/var-blodiga-historia/18406/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Vår blodiga historia
        </a>

        <a
          className="text-purple-800 font-bold hover:underline transform duration-300"
          href={`https://mariasbokhylla.wordpress.com/2018/03/30/forfattarintervju-leif-selander/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Författarintervju - Leif Selander
        </a>
      </div>
    </div>
  );
}
