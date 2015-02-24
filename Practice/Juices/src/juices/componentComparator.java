package juices;

import java.util.Comparator;

public class componentComparator implements Comparator<String> {

    @Override
    public int compare(String a, String b) {
        return a.compareTo(b);
    }

}
