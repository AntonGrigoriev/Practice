package juices;

import java.io.FileNotFoundException;
import java.io.IOException;

public class Main {

    public static void main(String[] args) throws InterruptedException {
        Juices juices = new Juices();
        try {
            juices.readData("juice.in");
            juices.writeList(juices.getComponents(), "juice1.out");
            juices.start();
            juices.join();
            juices.writeList(juices.getSortComponents(), "juice2.out");
            juices.findCountOfWashes();
            juices.writeCount("juice3.out");
        } catch (FileNotFoundException e) {
            System.out.println("File is not found.");
        } catch (IOException e) {
            System.out.println("Error.");
        }
    }

}
