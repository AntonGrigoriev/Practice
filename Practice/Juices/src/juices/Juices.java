package juices;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.Scanner;
import java.util.StringTokenizer;

public class Juices extends Thread {

    private ArrayList<Juice> juices;
    private ArrayList<String> components;
    private ArrayList<String> sortComponents;
    private int countOfWashes;

    public Juices() {
        juices = new ArrayList<>();
        components = new ArrayList<>();
        sortComponents = new ArrayList<>();
        countOfWashes = 0;
    }

    public void readData(String path) throws FileNotFoundException {
        Scanner sc = new Scanner(new FileReader(path));
        ArrayList<String> tmp = new ArrayList<>();
        while (sc.hasNextLine()) {
            tmp.clear();
            StringTokenizer st = new StringTokenizer(sc.nextLine());
            while (st.hasMoreTokens()) {
                String str = st.nextToken();
                if (!components.contains(str)) {
                    components.add(str);
                }
                tmp.add(str);
            }
            juices.add(new Juice(tmp));
        }
    }

    private void sortComponents() {
        sortComponents = new ArrayList<>(components);
        Collections.sort(sortComponents, new componentComparator());
    }

    public ArrayList<String> getComponents() {
        return components;
    }

    public ArrayList<String> getSortComponents() {
        return sortComponents;
    }

    public void writeList(ArrayList<String> list, String path) throws IOException {
        FileWriter fw = new FileWriter(path);
        Iterator<String> it = list.iterator();
        while (it.hasNext()) {
            fw.write(it.next() + "\r\n");
        }
        fw.close();
    }

    public void findCountOfWashes() {
        countOfWashes = juices.size();
        ArrayList<Juice> tmp = new ArrayList<>(juices);
        Collections.sort(tmp, new juiceComparator());
        for (int i = 0; i < tmp.size(); i++) {
            for (int j = i + 1; j < tmp.size(); j++) {
                if (tmp.get(j).isContain(tmp.get(i))) {
                    countOfWashes--;
                    tmp.set(i, tmp.get(j));
                    tmp.remove(j);
                    i--;
                    break;
                }
            }
        }
    }

    public void writeCount(String path) throws IOException {
        FileWriter fw = new FileWriter(path);
        fw.write("" + countOfWashes);
        fw.close();
    }

    @Override
    public void run() {
        sortComponents();
    }

}
