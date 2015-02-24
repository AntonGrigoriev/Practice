package juices;

import java.util.ArrayList;

public class Juice {

    private ArrayList<String> components;

    public Juice(ArrayList<String> juice) {
        components = new ArrayList<>(juice);
    }

    public int getCount() {
        return components.size();
    }

    public boolean isContain(Juice juice) {
        for (int i = 0; i < juice.components.size(); i++) {
            if (!this.components.contains(juice.components.get(i))) {
                return false;
            }
        }
        return true;
    }

}
