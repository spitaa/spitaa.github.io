export default class Ministage {

    static elaboraInput(tastoPremuto) {
        // Il movimento viene rappresentato nel seguente modo
        // y            -1
        // |            |
        // |       -1 - 🚀 - +1
        // |            |
        // |           +1
        // |
        // ---------------------- x

        let valoreX = 0, valoreY = 0

        let deveSparare = false

        switch (tastoPremuto) {
            case 'ArrowRight': //Freccia a destra
                valoreX = 1
                break;
            case 'ArrowLeft': //Freccia a sinistra
                valoreX = -1
                break;
            case 'ArrowUp': //Freccia sù
                valoreY = -1
                break;
            case 'ArrowDown': //Freccia giù
                valoreY = 1
                break;
            case ' ': //tasto spazio
                //se viene premuto il tasto, mettiamo "deveSparare" a true
                deveSparare = true
                break;
        }

        // rimandiamo al gioco il moviment in base all'input (x e y) e se sparare o meno (true/false)
        return { 'x': valoreX, 'y': valoreY, 'spara': deveSparare }
    }

    static avanzaDiLivello(statistiche) {
        // statistiche:
        //      rateoDiFuoco,
        //      vitaMassima, 
        //      velocità

        statistiche.rateoDiFuoco += 1
        statistiche.vitaMassima += 1
        statistiche.velocità += 100

        return statistiche
    }
}